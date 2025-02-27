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
  const [blueDescriberIndex, setBlueDescriberIndex] = useState(0);
  const [greenDescriberIndex, setGreenDescriberIndex] = useState(0);
  const [currentDescriber, setCurrentDescriber] = useState(null);
  const [describerResponse, setDescriberResponse] = useState("");


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
      event.preventDefault();
      localStorage.setItem("roomCode", roomCode);
      alert("Room code saved!");
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

// will need to adjsut this later on when we have service/database stuff
  const generateRandomUsers = (num) => {
    const randomUsers = [];
    for (let i = 1; i <= num; i++) {
      randomUsers.push({
        username: `Player_${Math.floor(Math.random() * 1000)}`,
        turn: "",
      guessedWord: "" 
      });
    }
    return randomUsers;
  };
// getRandomWord andn getRandomDescription are for demo purposes, will change in future
  const getRandomWord = () => {
    const words = ["apple"];
    return words[Math.floor(Math.random() * words.length)];
  };

  const getRandomDescription = () => {
    const descriptions = ["Its a red fruit", "Its red and you can eat it", "A red fruit that is sweet in crispy", "fruit that comes in three colors of red, gold, and green", "fruit that comes from a tree", " a _____ a day keeps the doctor away"];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  const pickDescriber = () => {
    if (!blueTeam.length || !greenTeam.length) {
      console.warn("Cannot pick describer: Teams are empty.");
      return;
    }

    let describer;
    let response;
  
    if (teamTurn === "blue") {
      describer = blueTeam[blueDescriberIndex % blueTeam.length];
      setBlueDescriberIndex((prev) => (prev + 1) % blueTeam.length); 
    } else {
      describer = greenTeam[greenDescriberIndex % greenTeam.length];
      setGreenDescriberIndex((prev) => (prev + 1) % greenTeam.length);
    }
    response = getRandomDescription();
    setCurrentDescriber(describer);
    setDescriberResponse(response);

    
  };
  

  const initializeTeams = () => {
    setBlueTeamPts(0)
    setGreenTeamPts(0)
    const blue = generateRandomUsers(3);
    const green = generateRandomUsers(3);
    setBlueTeam(blue);
    setGreenTeam(green);
    setTeamsInitialized(true);

    localStorage.setItem("blueTeam", JSON.stringify(blue));
    localStorage.setItem("greenTeam", JSON.stringify(green));
  };

  const initializeGame = () => {
    setTimeout(() => {
      pickDescriber();
      startRound();
    }, 100);
    
  }

  const startRound = () => {
    if (winCondition) return;
    setTimer(10); // Reset timer
    setRandomWord(getRandomWord());

  }

  useEffect(() => {
    if (guessedWord === randomWord && randomWord !== "") {
      alert("Team switch");
      setTeamTurn((prev) => (prev === "blue" ? "green" : "blue")); 
      setRandomWord(getRandomWord());
      setGuessedWord("");
    }
  }, [guessedWord, randomWord]);

  useEffect(() => {
    if (!currentDescriber) return;
  
    setBlueTeam((prevBlueTeam) =>
      prevBlueTeam.map((player) => ({
        ...player,
        turn: player.username === currentDescriber.username ? "Describer" : "",
      }))
    );
  
    setGreenTeam((prevGreenTeam) =>
      prevGreenTeam.map((player) => ({
        ...player,
        turn: player.username === currentDescriber.username ? "Describer" : "",
      }))
    );
  }, [currentDescriber]);

  useEffect(() => {
    if (teamsInitialized) {
      pickDescriber();
    }
  }, [teamTurn]);
  

  const endRound = () => {
    if (teamTurn === "blue") {
      setGreenTeamPts((prev) => prev + 1);
    } else {
      setBlueTeamPts((prev) => prev + 1);
    }


    // Check for win condition
    if (blueTeamPts >= 5 || greenTeamPts >= 5) {
      setWinCondition(true);
      alert(`${blueTeamPts >= 5 ? "Blue Team" : "Green Team"} Wins!`);
    } else {
      startRound();
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
                    <tr key={index} className={player.turn === "Describer" ? "highlight" : ""}>
                      <td>{player.username}</td>
                      <td>{player.turn}</td>
                      <td>{player.guessedWord}</td>
                    </tr>
                  ))}
                  {/* Include current user for demo puprposes only */}
                  <tr>
                    <td id="UserName">{userName}</td>
                    <td id="Turn"></td>
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
          <div>
          <button className="btn btn-primary w100" onClick={initializeTeams }>Set Teams!</button>
          <button className="btn btn-success w100" onClick={initializeGame }>Play Game!</button>
          </div>
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
              readOnly
              value={currentDescriber ? `${currentDescriber.username} is describing: ${describerResponse}` : "Waiting for describer..."}
          />
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
                    <tr key={index} className={player.turn === "Describer" ? "highlight" : ""}>
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