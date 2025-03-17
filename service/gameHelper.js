const axios = require('axios');

//section of running the game/rounds
function runGame(gameState){
    console.log("roundLoop will be called");//testing purposes, delete later;
    function roundLoop() {
        if (gameState.winCondition) {
          console.log("Game ended.");
          hardReset(gameState);
          return;
        }
        if (gameState.timer > 0) {
          setTimeout(() => {
            //increments timer to run out every 1 second
            gameState.timer--;
            roundLoop();
          }, 1000);
        } else {
          endRound(gameState);
          roundLoop();
        }
      }
      roundLoop();
}

async function startRound(gameState){
    if (gameState.winCondition) return;
        gameState.timer = 10; //5 second runs for testing, I'll change in the future
        gameState.randomWord = getRandomWord();
        console.log(`Round started. New word: ${gameState.randomWord}`);
}

function endRound(gameState){
    if (gameState.teamTurn === "blue") {
        gameState.greenTeamPts++;
      } else {
        gameState.blueTeamPts++;
      }
    
      if (gameState.blueTeamPts >= 6 || gameState.greenTeamPts >= 6) {
        gameState.winCondition = true;
        console.log("Game over.");
      } else {
        startRound(gameState);
      }
}

function compareWords(gameState, guessedWord){
    if (gameState.randomWord.trim().toLowerCase() === guessedWord.toLowerCase()){
        const guessingTeam = gameState.teamTurn === "blue" ? "green" : "blue";
        gameState.teamTurn = guessingTeam
        gameState.randomWord = getRandomWord();
        pickDescriber(gameState);
    } 
    //else do nothing, could add extra stuff here
}

function pickDescriber(gameState) {
    let currentTeam = gameState.teamTurn === "blue" ? gameState.blueTeam : gameState.greenTeam;
    let teamKeys = Object.keys(currentTeam);
    let describerIndex = gameState.teamTurn === "blue" ? gameState.blueDescriberIndex : gameState.greenDescriberIndex;
  
    if (teamKeys.length === 0) {
      console.warn("Teams are empty! Cannot pick describer.");
      return;
    }

    let selectedDescriber = teamKeys[describerIndex % teamKeys.length];
    gameState.currentDescriber = { username: selectedDescriber };

    if (gameState.teamTurn === "blue") {
        gameState.blueDescriberIndex = (describerIndex + 1) % teamKeys.length;
    } else {
        gameState.greenDescriberIndex = (describerIndex + 1) % teamKeys.length;
    }
    
    gameState.describerResponse = "";//this will be set with the description endpoint
  }

//section for helper functions

function getRandomWord() {
    // waiting on API from wordnik
    const words = ["apple"];
    return words[Math.floor(Math.random() * words.length)];
}
//soft reset which allows you to restart the game witihout resetting teams or roomCode
function resetGame(gameState){
  gameState.blueDescriberIndex = 0;
  gameState.greenDescriberIndex = 0;
  gameState.greenTeamPts = 0;
  gameState.blueTeamPts = 0;
  gameState.timer = 0;
  gameState.random = '';
  gameState.currentDescriber = null;
  gameState.describerResponse = "";
  gameState.teamTurn = 'blue';
  gameState.winCondition = false;
}
//this function basically resets every field including roomCode
function hardReset(gameState){
  setTimeout(() => {
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

      console.log("Game state has been reset.");
    }
  }, 30000); 

}


//Endpoint makes this obsolete, but keep it for testing purposes
// function getRandomDescription() {
//     const descriptions = [
//       "It's a red fruit",
//       "It's red and you can eat it",
//       "A red fruit that's sweet and crispy",
//       "Fruit that comes in three colors: red, gold, and green",
//       "Fruit that comes from a tree",
//       "A _____ a day keeps the doctor away"
//     ];
//     return descriptions[Math.floor(Math.random() * descriptions.length)];
//   }

  module.exports = {
    compareWords,
    pickDescriber,
    getRandomWord,
    startRound,
    endRound,
    runGame,
    resetGame
  };