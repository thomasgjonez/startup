const ninjaAPIKey = 'gdUXgBuLnhEv/my9sMG25A==bJmFMklsLvLluQa2'

//section of running the game/rounds
function runGame(gameState){
    function roundLoop() {
        if (gameState.winCondition) {
          console.log("Game ended.");
          hardReset(gameState);
          return;
        }
        if (gameState.timer > 0) {
          setTimeout(() => {
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
        gameState.timer = 10; //10 second runs for testing, I'll change in the future
        gameState.randomWord = await getRandomWord();
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

async function getRandomWord() {
  try {
      const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
          method: 'GET',
          headers: { 'X-Api-Key': ninjaAPIKey }
      });

      if (!response.ok) throw new Error('Failed to fetch word');

      const data = await response.json();
      console.log('Random Word:', data.word);

      const word = Adata.word[0];
      
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

  module.exports = {
    getRandomWord,
    compareWords,
    pickDescriber,
    getRandomWord,
    startRound,
    endRound,
    runGame,
    resetGame
  };