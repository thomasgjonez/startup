import React from 'react';
import { useState, useEffect } from 'react';
import './game.css'

export function Game({userName}) {
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState();
  const [guessedWord, setGuessedWord] = useState("");
  const [blueTeam, setBlueTeam] = useState([]);
  const [blueTeamPts, setBlueTeamPts] = useState(0);
  const [greenTeamPts, setGreenTeamPts] = useState(0);
  const [greenTeam, setGreenTeam] = useState([]);
  const [teamsInitialized, setTeamsInitialized] = useState(false);
  const [teamTurn, setTeamTurn] = useState("blue");
  const [randomWord, setRandomWord] = useState("");
  const [winCondition, setWinCondition] = useState(false);

  // Load saved room code from localStorage on mount
  useEffect(() => {
    const storedCode = localStorage.getItem("roomCode");
    if (storedCode) {
      setRoomCode(storedCode);
    }
  }, []);

  const handleRoomChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleGuessedWordChange = (event) => {
    setGuessedWord(event.target.value);
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      localStorage.setItem("roomCode", roomCode);
      localStorage.setItem("guessedWord", guessedWord);
      alert("Room code and guessedWord saved!");
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      endRound();
    }
  }, [timer]);


  const generateRandomUsers = (num) => {
    const randomUsers = [];
    for (let i = 1; i <= num; i++) {
      randomUsers.push({
        username: `Player_${Math.floor(Math.random() * 1000)}`,
        turn: i === 1 ? "Your turn" : "Not Yet", // First player starts
        guessedWord: i === 1 ? "N/A" : ""
      });
    }
    return randomUsers;
  };

  const getRandomWord = () => {
    return "apple"
  };

  const pickDescriber = (team) => {

  };

  const initializeTeams = () => {
    setBlueTeam(generateRandomUsers(4));
    setGreenTeam(generateRandomUsers(4));
    setTeamsInitialized(true);
  };

  const initializaGame = () => {
    {/*startTimer()*/}
    initializeTeams()
    startRound()
  }

  const startRound = () => {
    if (winCondition) return;

    const word = getRandomWord();
    const chosenDescriber = pickDescriber(teamTurn);
    setRandomWord(word);
    {/*setDescriber(chosenDescriber);*/}
    setTimer(5); // Reset timer
  }

  const endRound = () => {
    if (guessedWord === randomWord) {
      setTeamTurn((prev) => (prev === "blue" ? "green" : "blue")); // Switch turns
    } else {
      if (teamTurn === "blue") {
        setGreenTeamPts((prev) => prev + 1);
      } else {
        setBlueTeamPts((prev) => prev + 1);
      }
    }

    // Check for win condition
    if (blueTeamPts >= 5 || greenTeamPts >= 5) {
      setWinCondition(true);
      alert(`${blueTeamPts >= 5 ? "Blue Team" : "Green Team"} Wins!`);
    } else {
      startRound(); // Start next round
    }
  };


  return (
    <div className="container-fluid flex-grow-1">
      <div className="row h-100">
        {/* Blue Team Section */}
        <section className="col-md-4 d-flex flex-column justify-content-start align-items-center" style={{ marginTop: '10vh' }}>
          <h2 className="Team" id="Team-one">Blue Team Score: {blueTeamPts} </h2>
          <table className="team-one">
            <thead>
              <tr>
                <th>UserName</th>
                <th>Turn</th>
                <th>Guessed Word</th>
              </tr>
            </thead>
            <tbody>
              {blueTeam.length > 0 && (
                <>
                  {blueTeam.map((player, index) => (
                    <tr key={index}>
                      <td>{player.username}</td>
                      <td>{player.turn}</td>
                      <td>{player.guessedWord}</td>
                    </tr>
                  ))}
                  {/* Include current user for demo puprposes only */}
                  <tr>
                    <td id="UserName">{userName}</td>
                    <td id="Turn">Not Yet</td>
                    <td id="UserNameWordGuessed">{guessedWord}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>
        {/* Game Controls Section */}
        <section className="col-md-4 d-flex flex-column justify-content-center align-items-center">
        <div className="text-center">
          <h2>Time Left: {timer} seconds</h2>
        </div>
          <h2>Room Code: {roomCode} </h2>
          <form action="#" method="POST" className="w-75 pb-1">
            <label htmlFor="room-code"></label>
            <input
              type="text"
              id="room-code"
              className="form-control mb-2"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={handleRoomChange}
              onKeyDown={handleKeyPress}
            />
          </form>
          <button className="btn btn-success w100" onClick={initializaGame }>Play Game!</button>
          <form action="#" method="post" className="w-50 mt-2">
            <input
              type="text"
              id="GuessWordBox"
              className="form-control mb-3"
              placeholder="Guess the Word!"
              value={guessedWord}
              onChange={handleGuessedWordChange}
              onKeyDown={handleKeyPress}
              
            />
          </form>
          <form action="#" method="post" className="w-100">
            <textarea
              id="DescriptionWordBox"
              className="form-control mb-2 py-3"
              rows="4"
              readOnly>
            
              Describe the Word if it's your turn!
            </textarea>
          </form>

          <div className="board-container">
            <img
              src="/game-pieces/catchphraseboard.png"
              alt="Board"
              className="board"
            />
            <img
              src="/game-pieces/bluepiece.png"
              alt="Blue Piece"
              className="game-piece blue-piece"
            />
            <img
              src="/game-pieces/greenpiece.png"
              alt="Green Piece"
              className="game-piece green-piece"
            />
          </div>
        </section>

        {/* Green Team Section */}
        <section className="col-md-4 d-flex flex-column justify-content-start align-items-center" style={{ marginTop: '10vh' }}>
          <h2 className="Team" id="Team-two">Green Team Score: {greenTeamPts} </h2>
          <table className="team-two">
            <thead>
              <tr>
                <th>UserName</th>
                <th>Turn</th>
                <th>Guessed Word</th>
              </tr>
            </thead>
            <tbody>
              {greenTeam.length > 0 && (
                <>
                  {greenTeam.map((player, index) => (
                    <tr key={index}>
                      <td>{player.username}</td>
                      <td>{player.turn}</td>
                      <td>{player.guessedWord}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
                  
        </section>
      </div>
    </div>
  );
}