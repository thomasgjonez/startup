const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// The games and users are saved in memory and disappear whenever the service is restarted.
let users = [];
let games = {};

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

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
apiRouter.post('/game/createOrJoinRoom',(req,res) => {
    const {roomCode, username} = req.body;
    if (!roomCode){
        return res.status(400).send({msg:"Room Code is required"});
    }
    if (!username){
        return res.status(400).send({msg:"Username is required/you need to login in. How did you even get to this screen lol"})
    }
    // creates an empty gameState/object with the roomCode
    let gameState = games[roomCode];
    //checks to make sure there is no game going on, if not make a gameState
    if (!gameState){
        gameState = {
            roomCode,
            players: [],         // Temp array to hold all da players, which will be split up later
            blueTeam: [],        
            greenTeam: [],
            blueTeamPts: 0,
            greenTeamPts: 0,
            timer: 0,
            randomWord: '',
            currentDescriber: null,
            teamTurn: 'blue',
        }
        games[roomCode] = gameState;
    }
    //checks to see if player is in the game already, if not-> add them
    if (!gameState.players.find(player => player.username === username)) {
        gameState.players.push({ username, guessedWord: '', turn: '' });
      }
    
      res.status(200).send({ msg: 'Joined game', gameState });

});

//Team and Player Setup section

//Round Management

//Game State and updates

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
  });


//Helper functions/middleware wil go here
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

  // setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});