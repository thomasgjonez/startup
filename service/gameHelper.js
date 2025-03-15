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

function startRound(){
    return null;
}

function endRound(){
    return null;
}

//section for helper functions
function getRandomWord() {
    //will need to change to an api call for the dictionary, but lets get the game working first
    const words = ["apple", "banana", "orange"];
    return words[Math.floor(Math.random() * words.length)];
  }

  module.exports = {
    getRandomWord,
    startRound,
    endRound,
    runGame
  };