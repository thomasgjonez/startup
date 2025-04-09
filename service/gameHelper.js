const { peerProxy, getSocketServer } = require('./peerProxy.js');
const { GameEvent } = require('../src/pages/game/gameNotifier'); 

const ninjaAPIKey = 'gdUXgBuLnhEv/my9sMG25A==bJmFMklsLvLluQa2'
const DB = require('./database');

//section of running the game/rounds
function runGame(initialGameState){
    async function roundLoop() {
      const gameState = await DB.getGame(initialGameState.roomCode);

        if (gameState.winCondition) {
          console.log("Game ended.");
          hardReset(gameState);
          return;
        }

        if (gameState.timer > 0) {
          setTimeout(async() => {
          gameState.timer--;
          await DB.updateTimer(gameState.roomCode, gameState.timer);
          broadcastGameState(gameState);
          roundLoop();
          }, 1000);
        } else {
          await endRound(gameState);
          roundLoop();
        }
      }
      roundLoop();
}

async function startRound(gameState){//really should be named start game as it only deals with the original round
    if (gameState.winCondition) return;
        gameState.timer = 30; //10 second runs for testing, I'll change in the future
        gameState.randomWord = await getRandomWord();
        console.log(`Round started. New word: ${gameState.randomWord}`);

        await DB.saveGame(gameState);
        broadcastGameState(gameState);
}

async function endRound(staleState){
    const gameState = await DB.getGame(staleState.roomCode);
    if (gameState.teamTurn === "blue") {
        gameState.greenTeamPts++;
      } else {
        gameState.blueTeamPts++;
      }
    
      if (gameState.blueTeamPts >= 6 || gameState.greenTeamPts >= 6) {
        gameState.winCondition = true;
        console.log("Game over.");
        await DB.saveGame(gameState);
        broadcastGameState(gameState);
        return;
      }
      gameState.wordGuessed = false;
      gameState.timer = 30;
      gameState.randomWord = await getRandomWord();
      await pickDescriber(gameState);
    
      Object.values(gameState.blueTeam).forEach(p => p.guessedWord = '');
      Object.values(gameState.greenTeam).forEach(p => p.guessedWord = '');
    
      await DB.saveGame(gameState)
      broadcastGameState(gameState);;
}

async function compareWords(staleGameState, guessedWord){
    const gameState = await DB.getGame(staleGameState.roomCode);
    const expected = (gameState.randomWord || "").trim().toLowerCase();
    const actual = (guessedWord || "").trim().toLowerCase();
  
    if (expected === actual) {
      console.log("Word matched! Switching team...");
      gameState.teamTurn = gameState.teamTurn === 'blue' ? 'green' : 'blue';
  
      gameState.randomWord = await getRandomWord();
      Object.values(gameState.blueTeam).forEach(p => (p.guessedWord = ""));
      Object.values(gameState.greenTeam).forEach(p => (p.guessedWord = ""));
      await pickDescriber(gameState);
      await DB.saveGame(gameState);
    } else {
      console.log("words did not match");
    }
}

async function pickDescriber(gameState) {
    let currentTeam = gameState.teamTurn === 'blue' ? gameState.blueTeam : gameState.greenTeam;
    let teamKeys = Object.keys(currentTeam);
    let describerIndex = gameState.teamTurn === 'blue' ? gameState.blueDescriberIndex : gameState.greenDescriberIndex;
  
    if (teamKeys.length === 0) {
      console.warn("Teams are empty! Cannot pick describer.");
      return;
    }

    let selectedDescriber = teamKeys[describerIndex % teamKeys.length];
    gameState.currentDescriber = { username: selectedDescriber };

    if (gameState.teamTurn === 'blue') {
        gameState.blueDescriberIndex = (describerIndex + 1) % teamKeys.length;
    } else {
        gameState.greenDescriberIndex = (describerIndex + 1) % teamKeys.length;
    }
    
    gameState.describerResponse = "";//this will be set with the description endpoint
    
    await DB.saveGame(gameState);
    broadcastGameState(gameState);
    notifyDescriber(gameState);
  }

//section for helper functions

async function getRandomWord() {
  try {
      const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
          method: 'GET',
          headers: { 'X-Api-Key': ninjaAPIKey }
      });

      if (!response.ok) throw new Error('Failed to fetch word');

      const data = await response.json();
      console.log('Random Word:', data.word);

      const word = data.word[0];
      
      console.log('Random Word:', word);
      return word;
  } catch (error) {
      console.error('Error fetching word:', error);
      return null;
  }
}
//soft reset which allows you to restart the game witihout resetting teams or roomCode
function resetGame(gameState){
  gameState.blueDescriberIndex = 0;
  gameState.greenDescriberIndex = 0;
  gameState.greenTeamPts = 0;
  gameState.blueTeamPts = 0;
  gameState.timer = 0;
  gameState.randomWord = '';
  gameState.currentDescriber = null;
  gameState.describerResponse = "";
  gameState.teamTurn = 'blue';
  gameState.winCondition = false;
}
//this function basically resets every field including roomCode
function hardReset(gameState){
  setTimeout(async() => {
    if (gameState) {
      gameState.roomCode = "";
      gameState.players = {};
      gameState.blueTeam = {};
      gameState.greenTeam = {};
      gameState.blueTeamPts = 0;
      gameState.greenTeamPts = 0;
      gameState.timer = 0;
      gameState.randomWord = "";
      gameState.currentDescriber = null;
      gameState.teamTurn = "blue";
      gameState.blueDescriberIndex = 0;
      gameState.greenDescriberIndex = 0;
      gameState.describerResponse = "";
      gameState.winCondition = false;

      await DB.saveGame(gameState);
      broadcastGameState(gameState);
      console.log("Game state has been reset.");
    }
  }, 15000);
}
function broadcastGameState(gameState) {
  const socketServer = getSocketServer();

  const message = JSON.stringify({
    from: 'server',
    type: GameEvent.GameUpdate,
    value: gameState,
  });

  socketServer.clients.forEach((client) => {
    if (
      client.readyState === 1 && // WebSocket.OPEN
      client.roomCode === gameState.roomCode
    ) {
      client.send(message);
    }
  });
}
function notifyDescriber(gameState) {
  const socketServer = getSocketServer();
  const currentDescriberUsername = gameState.currentDescriber?.username;

  if (!currentDescriberUsername) return;

  const message = JSON.stringify({
    type: GameEvent.DescriberSelected,
    value: {
      roomCode: gameState.roomCode,
      randomWord: gameState.randomWord,
      describer: currentDescriberUsername,
    },
  });

  socketServer.clients.forEach((client) => {
    if (
      client.readyState === 1 &&
      client.roomCode === gameState.roomCode &&
      client.username === currentDescriberUsername
    ) {
      client.send(message);
    }
  });
}

  module.exports = {
    getRandomWord,
    compareWords,
    pickDescriber,
    startRound,
    endRound,
    runGame,
    resetGame,
    broadcastGameState,
    notifyDescriber
  };