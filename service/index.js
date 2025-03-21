const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const { runGame, pickDescriber, startRound, compareWords, getRandomWord, resetGame } = require('./gameHelper');


const authCookieName = 'token';

// The games and users are saved in memory and disappear whenever the service is restarted.
const users = [];
const games = {};
const chatMessages = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting, will need to add public index later
app.use(express.static('public'));


let apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('username', req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await createUser(req.body.username, req.body.email, req.body.password);
  
      setAuthCookie(res, user.token);
      res.send({ username: user.username});
    }
  });

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        setAuthCookie(res, user.token);
        res.send({ username: user.username});
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
  });
  
// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  });

//Game Room managment section
apiRouter.post('/game/createOrJoinRoom', requireAuth, (req,res) => {
    console.log('createOrJoinRoom endpoint called')
    try{
      const {roomCode, username} = req.body;
      if (!roomCode){
          return res.status(400).send({msg:'Room Code is required'});
      }
      // creates an empty gameState/object with the roomCode
      let gameState = games[roomCode];
      //checks to make sure there is no game going on, if not make a gameState
      if (!gameState){
          gameState = {
              roomCode,
              players: {},         // Temp dictionary to hold all da players, which will be split up later
              blueTeam: {},        
              greenTeam: {},
              blueTeamPts: 0,
              greenTeamPts: 0,
              timer: 0,
              randomWord: '',
              currentDescriber: null,
              teamTurn: 'blue',
              blueDescriberIndex: 0,
              greenDescriberIndex: 0,
              describerResponse: "",
              winCondition: false,
          }
          games[roomCode] = gameState;
      }
      //checks to see if player is in the game already, if not-> add them
      if (!gameState.players[username]) {
        gameState.players[username] = { guessedWord: '', turn: '' };
        }
      
        res.status(200).send({ msg: 'Joined game', gameState });
      }catch(error){
          console.error("Error in /game/createOrJoinRoom:", error);
          return res.status(500).send({ msg: 'Internal Server Error' });
      }

  });

  //Team and Player Setup section
  apiRouter.post('/game/setTeams', requireAuth, (req, res) => {
      const { roomCode } = req.body;
      if (!roomCode){
          return res.status(400).send({msg:'Room Code is required'});
      }
      const gameState = games[roomCode];
      if (!gameState) {
          return res.status(404).send({ msg: 'Game room not found, most likely internal error. Make sure you enter room code again' });
      }
      if (!gameState.players || gameState.players.length < 2) {
          return res.status(400).send({ msg: 'Not enough players to form teams' });
        }
      // reset the teams before adding to them
      gameState.blueTeam = {};
      gameState.greenTeam = {};
      resetGame(gameState);
      //add every other player to team
      const playerNames = Object.keys(gameState.players);
      playerNames.forEach((username, index) => {
        if (index % 2 === 0) {
            gameState.blueTeam[username] = { guessedWord: '', turn: '' };
        } else {
            gameState.greenTeam[username] = { guessedWord: '', turn: '' };
        }
    });

      res.status(200).send({ msg: 'Teams have been set successfully', gameState });

}
)

//Round Management, pick describer, get random word, start and end rounds, timer etc
apiRouter.post('/game/start', requireAuth, (req, res) => {
  console.log('start game endpoint hit');
  const { roomCode } = req.body;
  if (!roomCode) {
    console.log('Room code not found');
    return res.status(400).send({ msg: 'Room code is required' });
  }
  const gameState = games[roomCode];
  if (!gameState) {
    console.log('game state not found');
    return res.status(404).send({ msg: 'Game room not found' });
  }
  resetGame(gameState);
  try {
    pickDescriber(gameState);
    startRound(gameState);
    runGame(gameState);

    res.status(200).send({ msg: `Game started for room ${roomCode}`, gameState });

  } catch (error) {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

//Game State and updates
apiRouter.post('/game/guessWord', requireAuth, (req, res) => {
  console.log("Received guessWord request:", req.body);

  const { roomCode, guessedWord, username } = req.body;
  
  if (!roomCode || !guessedWord || !username) {
      console.error("Missing roomCode or guessedWord");
      return res.status(400).send({ msg: 'roomCode and guessedWord are required' });
  }

  const gameState = games[roomCode];
  
  if (!gameState) {
      console.error(`Game room not found: ${roomCode}`);
      return res.status(404).send({ msg: 'Game room not found' });
  }

  try {
      if (gameState.blueTeam[username]) {
        gameState.blueTeam[username].guessedWord = guessedWord;
    } else if (gameState.greenTeam[username]) {
        gameState.greenTeam[username].guessedWord = guessedWord;
    } else {
        console.error(`Player ${username} not found in any team`);
        return res.status(404).send({ msg: 'Player not found in any team' });
    }

      console.log(`Updated guessed word for ${username}: ${guessedWord}`);

      compareWords(gameState, guessedWord);
      res.status(200).send({ msg: 'Guess submitted successfully', gameState });
  } catch (error) {
      console.error("Error processing guess:", error);
      res.status(500).send({ msg: 'Internal Server Error' });
  }
});


apiRouter.post('/game/description', requireAuth, (req, res) => {
  const {roomCode, username, description} = req.body;
  const gameState = games[roomCode];
  if (!gameState) {
    return res.status(404).send({ msg: 'Game room not found' });
  }
  //make sure the current describer is the one writting
  if (!gameState.currentDescriber || gameState.currentDescriber.username !== username) {
    return res.status(403).send({ msg: 'You are not the current describer' });
  }

  gameState.describerResponse = description;
  //testing purposes, frontend will get rid of need for this 
  console.log(`New description for room ${roomCode}: ${description}`);
})

apiRouter.get('/game/state', requireAuth, (req, res) => {
  const {roomCode} = req.query;
  const gameState = games[roomCode];
  if (!gameState) {
    return res.status(404).send({ msg: 'Game room not found' });
  }
  return res.status(200).json(gameState);
})

//Live Chat section
apiRouter.post('/main/addMessage', requireAuth, (req, res) => {
  const {username, message} = req.body;
  if (!message){
    console.log('no message')
    return res.status(400).send({msg: 'No chat message'})
  }
  if (!username){
    console.log('no username')
  }
  chatMessages.push({username, message});

  return res.status(200).send({ msg: 'Message added successfully' });
})
//
apiRouter.get('/main/getMessage', (req, res) => {
  if(!chatMessages || chatMessages.length === 0){
    return res.status(200).json([]);
  }
  res.status(200).json(chatMessages);
})

// apiRouter.delete('/main/clearChat', (req, res) => {
//   chatMessages.length = 0;
//   return res.status(200).json({ msg: "Chat cleared successfully" });;
// })

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
  });


//Helper functions for login and chat will go here
async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      username: username,
      email: email,
      password: passwordHash,
      token: uuid.v4(),
    };
    users.push(user);
  
    return user;
  }
  
  async function findUser(field, value) {
    if (!value) return null;
  
    return users.find((u) => u[field] === value);
  }

  function requireAuth(req, res, next) {
    const token = req.cookies[authCookieName]; // Get the auth token from cookies

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const user = users.find(u => u.token === token);
    if (!user) {
        return res.status(403).json({ msg: 'Forbidden: Invalid token' });
    }

    req.user = user;
    next();
  }

  // setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
}


function clearChat() {
  chatMessages.length = 0; // Empty the chat array
  console.log("Chat cleared for all users.");
}

setInterval(() => {
  clearChat();
}, 30000);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});