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
function getRandomWord() {
    //will need to change to an api call for the dictionary, but lets get the game working first
    const words = ["apple", "banana", "orange"];
    return words[Math.floor(Math.random() * words.length)];
  }

//will need to change to an endpoint or maybe just get rid off all together
function getRandomDescription() {
    const descriptions = [
      "It's a red fruit",
      "It's red and you can eat it",
      "A red fruit that's sweet and crispy",
      "Fruit that comes in three colors: red, gold, and green",
      "Fruit that comes from a tree",
      "A _____ a day keeps the doctor away"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  module.exports = {
    pickDescriber,
    getRandomWord,
    startRound,
    endRound,
    runGame
  };