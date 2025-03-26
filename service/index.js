const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const { runGame, pickDescriber, startRound, compareWords, resetGame } = require('./gameHelper');
const DB = require('./database.js');

const authCookieName = 'token';

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
        const newToken = uuid.v4();
        await DB.updateUserToken(user.username, newToken);
        setAuthCookie(res, newToken);
        res.send({ username: user.username});
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
  });
  
// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser(token,'token');

    if (user) {
      await DB.updateUserToken(user.username, null);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  });

//Game Room managment section
apiRouter.post('/game/createOrJoinRoom', requireAuth, async (req,res) => {
    console.log('createOrJoinRoom endpoint called')
    try{
      const {roomCode, username} = req.body;
      if (!roomCode){
          return res.status(400).send({msg:'Room Code is required'});
      }
      // creates an empty gameState/object with the roomCode
      let gameState = await DB.getGame(roomCode);
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
              winCondition: false
          }
          
      }
      //checks to see if player is in the game already, if not-> add them
      if (!gameState.players[username]) {
        gameState.players[username] = { guessedWord: '', turn: '' };
        }

      await DB.saveGame(gameState);
      
        res.status(200).send({ msg: 'Joined game', gameState });
      }catch(error){
          console.error("Error in /game/createOrJoinRoom:", error);
          return res.status(500).send({ msg: 'Internal Server Error' });
      }

  });

  //Team and Player Setup section
  apiRouter.post('/game/setTeams', requireAuth, async (req, res) => {
      const { roomCode } = req.body;
      if (!roomCode){
          return res.status(400).send({msg:'Room Code is required'});
      }
      const gameState = await DB.getGame(roomCode);
      
      if (!gameState) {
          return res.status(404).send({ msg: 'Game room not found, most likely internal error. Make sure you enter room code again' });
      }
      if (!gameState.players || gameState.players.length < 2) {
          return res.status(400).send({ msg: 'Not enough players to form teams' });
        }
      // reset the teams before adding to them
      resetGame(gameState);
      gameState.blueTeam = {};
      gameState.greenTeam = {};
      //add every other player to team
      const playerNames = Object.keys(gameState.players);
      playerNames.forEach((username, index) => {
        if (index % 2 === 0) {
            gameState.blueTeam[username] = { guessedWord: '', turn: '' };
        } else {
            gameState.greenTeam[username] = { guessedWord: '', turn: '' };
        }
     });
      await DB.saveGame(gameState);

      res.status(200).send({ msg: 'Teams have been set successfully', gameState });

}
)

//Round Management, pick describer, get random word, start and end rounds, timer etc
apiRouter.post('/game/start', requireAuth, async (req, res) => {
  console.log('start game endpoint hit');
  const { roomCode } = req.body;
  if (!roomCode) {
    console.log('Room code not found');
    return res.status(400).send({ msg: 'Room code is required' });
  }
  const gameState = await DB.getGame(roomCode);

  if (!gameState) {
    console.log('game state not found');
    return res.status(404).send({ msg: 'Game room not found' });
  }

  try {
    resetGame(gameState);
    await pickDescriber(gameState);
    await startRound(gameState);
    await runGame(gameState);

    res.status(200).send({ msg: `Game started for room ${roomCode}`, gameState });

  } catch (error) {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

//Game State and updates
apiRouter.post('/game/guessWord', requireAuth, async (req, res) => {
  console.log("Received guessWord request:", req.body);

  const { roomCode, guessedWord, username } = req.body;
  
  if (!roomCode || !guessedWord || !username) {
      console.error("Missing roomCode or guessedWord");
      return res.status(400).send({ msg: 'roomCode and guessedWord are required' });
  }

  const gameState = await DB.getGame(roomCode);
  
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

      await compareWords(gameState, guessedWord);

      res.status(200).send({ msg: 'Guess submitted successfully', gameState });
  } catch (error) {
      console.error("Error processing guess:", error);
      res.status(500).send({ msg: 'Internal Server Error' });
  }
});


apiRouter.post('/game/description', requireAuth, async (req, res) => {
  const {roomCode, username, description} = req.body;
  const gameState = await DB.getGame(roomCode);
  if (!gameState) {
    return res.status(404).send({ msg: 'Game room not found' });
  }
  //make sure the current describer is the one writting
  if (!gameState.currentDescriber || gameState.currentDescriber.username !== username) {
    return res.status(403).send({ msg: 'You are not the current describer' });
  }

  gameState.describerResponse = description;
  
  await DB.saveGame(gameState);
})

apiRouter.get('/game/state', requireAuth, async(req, res) => {
  const {roomCode} = req.query;
  const gameState = await DB.getGame(roomCode);

  if (!gameState) {
    return res.status(404).send({ msg: 'Game room not found' });
  }
  return res.status(200).json(gameState);
})

//Live Chat section
apiRouter.post('/main/addMessage', requireAuth, async(req, res) => {
  const {username, message} = req.body;
  if (!message){
    console.log('no message')
    return res.status(400).send({msg: 'No chat message'})
  }
  if (!username){
    console.log('no username')
  }
  await DB.addChatMessage({username,  message})

  return res.status(200).send({ msg: 'Message added successfully' });
})
//
apiRouter.get('/main/getMessage', async (req, res) => {
  try {
    const messages = await DB.getChatMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    res.status(500).json({ msg: "Failed to get chat messages" });
  }
})


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
    await DB.addUser(user);
  
    return user;
  }
  
  async function findUser(field, value) {
    if (!value) return null;

    if (field === 'token') {
      return DB.getUserByToken(value);
    }
    return DB.getUser(value);
  }

  async function requireAuth(req, res, next) {
    const token = req.cookies[authCookieName]; // Get the auth token from cookies

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const user = await DB.getUserByToken(token);
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


async function clearChat() {
  try {
    const result = await DB.clearChatMessages(); 
    console.log(`Cleared ${result.deletedCount} chat messages.`);
  } catch (error) {
    console.error("Error clearing chat messages:", error);
  }
}

setInterval(() => {
  clearChat();
}, 30000);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});