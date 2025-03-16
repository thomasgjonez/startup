const axios = require('axios');

//section of running the game/rounds
function runGame(gameState){
    console.log("roundLoop will be called");//testing purposes, delete later;
    function roundLoop() {
        if (gameState.winCondition) {
          console.log("Game ended.");
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

function startRound(gameState){
    if (gameState.winCondition) return;
        gameState.timer = 5; //5 second runs for testing, I'll change in the future
        gameState.randomWord = getRandomWord();
        console.log(`Round started. New word: ${gameState.randomWord}`);
}

function endRound(gameState){
    if (gameState.teamTurn === "blue") {
        gameState.greenTeamPts++;
      } else {
        gameState.blueTeamPts++;
      }
    
      if (gameState.blueTeamPts >= 7 || gameState.greenTeamPts >= 7) {
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
    let describer;
    let response = getRandomDescription();
  
    if (gameState.teamTurn === "blue") {
      describer = gameState.blueTeam[gameState.blueDescriberIndex % gameState.blueTeam.length];
      gameState.blueDescriberIndex = (gameState.blueDescriberIndex + 1) % gameState.blueTeam.length;
    } else {
      describer = gameState.greenTeam[gameState.greenDescriberIndex % gameState.greenTeam.length];
      gameState.greenDescriberIndex = (gameState.greenDescriberIndex + 1) % gameState.greenTeam.length;
    }
  
    gameState.currentDescriber = describer;
    gameState.describerResponse = response;
  }

//section for helper functions
async function getRandomWord() {
    try {
        const response = await axios.get('https://random-words-api.vercel.app/word');
        // response is an array that consists of a word, definition, how to say it etc
        const wordObj = response.data[0];
        return wordObj.word;  
      } catch (error) {
        console.error('Error fetching random word:', error);
        return 'catchPhrase'; // Fallback word in case of error
      }
  }

//Endpoint makes this obsolete, but keep it just in case
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
    runGame
  };