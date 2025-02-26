import React from 'react';
import { useState, useEffect } from 'react';
import './game.css'

export function Game({userName}) {
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState(30);
  const [guessedWord, setGuessedWord] = useState("");
  const [blueTeam, setBlueTeam] = useState([]);
  const [greenTeam, setGreenTeam] = useState([]);
  const [teamsInitialized, setTeamsInitialized] = useState(false);

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

  const startTimer = () => {
    setTimer(10);
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown); // Stop the timer when it reaches 0
          alert("Time's up! This is just a mock, the timer will normally be much longer and random");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
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
  const initializeTeams = () => {
    setBlueTeam(generateRandomUsers(4));
    setGreenTeam(generateRandomUsers(4));
    setTeamsInitialized(true);
  };

  const initializaGame = () => {
    {/*startTimer()*/}
    initializeTeams()
    playGame()
  }


  return (
    <div className="container-fluid flex-grow-1">
      <div className="row h-100">
        {/* Blue Team Section */}
        <section className="col-md-4 d-flex flex-column justify-content-start align-items-center" style={{ marginTop: '10vh' }}>
          <h2 className="Team" id="Team-one">Blue Team</h2>
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
          <form action="#" method="post" className="w-50">
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
          <h2 className="Team" id="Team-two">Green Team</h2>
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