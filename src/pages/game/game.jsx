import React from 'react';
import { useState, useEffect } from 'react';
import './game.css'

export function Game({userName}) {
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState(10);
  const [guessedWord, setGuessedWord] = useState("");

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
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown); // Stop the timer when it reaches 0
          alert("Time's up! This is just a mock, the timer will normally be much longer and random");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every 1000 ms (1 second)
  };

  return (
    <div className="container-fluid flex-grow-1">
      <div className="row h-100">
        {/* Team One Section */}
        <section className="col-md-4 d-flex flex-column justify-content-start align-items-center" style={{ marginTop: '10vh' }}>
          <h2 className="Team" id="Team-one">Team One</h2>
          <table className="team-one">
            <thead>
              <tr>
                <th>UserName</th>
                <th>Turn</th>
                <th>Guessed Word</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="UserName">Johnsmith_1</td>
                <td id="Turn">Your turn</td>
                <td id="UserNameWordGuessed">N/A</td>
              </tr>
              <tr>
                <td id="UserName">{userName}</td>
                <td id="Turn">Not Yet</td>
                <td id="UserNameWordGuessed">{guessedWord}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Game Controls Section */}
        <section className="col-md-4 d-flex flex-column justify-content-center align-items-center">
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
          <button className="btn btn-success w100" onClick={startTimer}>Play Game!</button>
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

        {/* Team Two Section */}
        <section className="col-md-4 d-flex flex-column justify-content-start align-items-center" style={{ marginTop: '10vh' }}>
          <h2 id="Team-two">Team Two</h2>
          <table className="team-two">
            <thead>
              <tr>
                <th>UserName</th>
                <th>Turn</th>
                <th>Guessed Word</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="UserName">Johnsmith_15</td>
                <td id="Turn">Not Yet</td>
                <td id="UserNameWordGuessed">N/A</td>
              </tr>
              <tr>
                <td id="UserName">Johnsmith_20</td>
                <td id="Turn">Not Yet</td>
                <td id="UserNameWordGuessed">N/A</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}