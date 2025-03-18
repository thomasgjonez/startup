import React from 'react';
import { useState, useEffect } from 'react';
import './game.css'

export function Game({userName}) {
  const [gameState, setGameState] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState();
  const [userGuess, setUserGuess] = useState("");
  const [guessedWord, setGuessedWord] = useState("");
  const [blueTeam, setBlueTeam] = useState({});
  const [blueTeamPts, setBlueTeamPts] = useState(0);
  const [greenTeamPts, setGreenTeamPts] = useState(0);
  const [greenTeam, setGreenTeam] = useState({});
  const [teamsInitialized, setTeamsInitialized] = useState(false);
  const [teamTurn, setTeamTurn] = useState("blue");
  const [randomWord, setRandomWord] = useState("");
  const [winCondition, setWinCondition] = useState(false);
  const [blueDescriberIndex, setBlueDescriberIndex] = useState(0);
  const [greenDescriberIndex, setGreenDescriberIndex] = useState(0);
  const [currentDescriber, setCurrentDescriber] = useState(null);
  const [describerResponse, setDescriberResponse] = useState("");
  const [isUserDescriber, setIsUserDescriber] = useState(false);
  const predefinedBluePositions = [
    { left: "", top: "" },  // Position for score 0
    { left: "21.5px", top: "10px" },  // Position for score 1
    { left: "110px", top: "75px" },  // Position for score 2
    { left: "175px", top: "115px" },  // Position for score 3
    { left: "350px", top: "115px" },  // Position for score 4
    { left: "435px", top: "78px" },  // Position for score 5
    { left: "450px", top: "15px" },  // Position for score 6
  ];
  const predefinedGreenPositions = [
    { left: "", top: "" },  // Position for score 0
    { left: "75px", top: "15px" },  // Position for score 1
    { left: "135px", top: "75px" },  // Position for score 2
    { left: "230px", top: "125px" },  // Position for score 3
    { left: "295px", top: "125px" },  // Position for score 4
    { left: "391px", top: "80px" },  // Position for score 5
    { left: "500px", top: "10px" },  // Position for score 6
  ];

  // useEffect(() => {
  //   const storedCode = localStorage.getItem("roomCode");
  //   if (storedCode) {
  //     setRoomCode(storedCode);
  //   }
  // }, []);

  // const handleRoomChange = (event) => {
  //   setRoomCode(event.target.value);
  // };
  // const handleGuess = () => {
  //   setBlueTeam((prevBlueTeam) =>
  //     prevBlueTeam.map((player) =>
  //       player.username === userName
  //         ? { ...player, guessedWord: userGuess }
  //         : player
  //     )
  //   );
  
  //   setGreenTeam((prevGreenTeam) =>
  //     prevGreenTeam.map((player) =>
  //       player.username === userName
  //         ? { ...player, guessedWord: userGuess }
  //         : player
  //     )
  //   );

  //   setGuessedWord(userGuess);
  //   setUserGuess("");

  //   localStorage.setItem("blueTeam", JSON.stringify(blueTeam));
  //   localStorage.setItem("greenTeam", JSON.stringify(greenTeam));
  // };

  // Handle Enter key press
  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     localStorage.setItem("roomCode", roomCode);
  //     alert("Room code saved!");
  //   }
  // }
  // const handleKeyPressforWord = (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     handleGuess();
  //   }
  // }

  // useEffect(() => {
  //   if (timer > 0) {
  //     const countdown = setInterval(() => {
  //       setTimer((prevTime) => prevTime - 1);
  //     }, 1000);
  //     return () => clearInterval(countdown);
  //   } else if (timer === 0) {
  //     endRound();
  //   }
  // }, [timer]);

// will need to adjsut this later on when we have service/database stuff
//   const generateRandomUsers = (num) => {
//     const randomUsers = [];
//     for (let i = 1; i <= num; i++) {
//       randomUsers.push({
//         username: `Player_${Math.floor(Math.random() * 1000)}`,
//         turn: "",
//         guessedWord: "" 
//       });
//     }

//     return randomUsers;
//   };
// // getRandomWord andn getRandomDescription are for demo purposes, will change in future and are place holders for future APIs
//   const getRandomWord = () => {
//     const words = ["apple"];
//     return words[Math.floor(Math.random() * words.length)];
//   };

//   const getRandomDescription = () => {
//     const descriptions = ["Its a red fruit", "Its red and you can eat it", "A red fruit that is sweet in crispy", "fruit that comes in three colors of red, gold, and green", "fruit that comes from a tree", " a _____ a day keeps the doctor away"];
//     return descriptions[Math.floor(Math.random() * descriptions.length)];
//   }

//   const pickDescriber = () => {
//     if (!blueTeam.length || !greenTeam.length) {
//       console.warn("Cannot pick describer: Teams are empty.");
//       return;
//     }

//     let describer;
//     let response;
  
//     if (teamTurn === "blue") {
//       describer = blueTeam[blueDescriberIndex % blueTeam.length];
//       setBlueDescriberIndex((prev) => (prev + 1) % blueTeam.length); 
//     } else {
//       describer = greenTeam[greenDescriberIndex % greenTeam.length];
//       setGreenDescriberIndex((prev) => (prev + 1) % greenTeam.length);
//     }
//     response = getRandomDescription();
//     setCurrentDescriber(describer);
//     setDescriberResponse(response);

    
//   };

//This section is for UI changes for highlighting when someone is the current describer
// and having the enter a description for the word(works right now could )
  useEffect(() => {
    if (!currentDescriber) return;
  
    setBlueTeam((prevBlueTeam) => {
      const updatedBlueTeam = Object.entries(prevBlueTeam).reduce((acc, [username, player]) => {
        acc[username] = {
          ...player,
          turn: username === currentDescriber.username ? "Describer" : "",
        };
        return acc;
      }, {});
      return updatedBlueTeam;
    });
  
    setGreenTeam((prevGreenTeam) => {
      const updatedGreenTeam = Object.entries(prevGreenTeam).reduce((acc, [username, player]) => {
        acc[username] = {
          ...player,
          turn: username === currentDescriber.username ? "Describer" : "",
        };
        return acc;
      }, {});
      return updatedGreenTeam;
    });

    setIsUserDescriber(currentDescriber.username === userName);
  }, [currentDescriber]);
  
  useEffect(() => {
    if (isUserDescriber) {
      const userDescription = prompt(`It's your turn to describe the word "${randomWord}"! Enter your description:`);

      if (userDescription) {
        setDescriberResponse(userDescription);
      }
    }
  }, [isUserDescriber]);
  

  // const initializeTeams = () => {
  //   const blue = generateRandomUsers(3);
  //   const green = generateRandomUsers(3);
  //   blue.push({
  //     username: userName,
  //     turn: "",
  //     guessedWord: guessedWord 
  //   })
  //   setBlueTeam(blue);
  //   setGreenTeam(green);
  //   setTeamsInitialized(true);

  //   localStorage.setItem("blueTeam", JSON.stringify(blue));
  //   localStorage.setItem("greenTeam", JSON.stringify(green));
  // };

  // const initializeGame = () => {
  //   setBlueTeamPts(0);
  //   setGreenTeamPts(0);
  //   setTimeout(() => {
  //     pickDescriber();
  //     startRound();
  //   }, 100);
    
  // }

  // const startRound = () => {
  //   if (winCondition) return;
  //   setTimer(10); // Reset timer
  //   setRandomWord(getRandomWord());

  // }

  // useEffect(() => {
  //   if (guessedWord === randomWord && randomWord !== "") {
  //     alert("Team switch");
  //     setTeamTurn((prev) => (prev === "blue" ? "green" : "blue")); 
  //     setRandomWord(getRandomWord());
  //     setGuessedWord("");
  //   }
  // }, [guessedWord, randomWord]);

  // useEffect(() => {
  //   if (!currentDescriber) return;
  
  //   setBlueTeam((prevBlueTeam) =>
  //     prevBlueTeam.map((player) => ({
  //       ...player,
  //       turn: player.username === currentDescriber.username ? "Describer" : "",
  //     }))
  //   );
  
  //   setGreenTeam((prevGreenTeam) =>
  //     prevGreenTeam.map((player) => ({
  //       ...player,
  //       turn: player.username === currentDescriber.username ? "Describer" : "",
  //     }))
  //   );
  // }, [currentDescriber]);

  // useEffect(() => {
  //   if (teamsInitialized) {
  //     pickDescriber();
  //   }
  // }, [teamTurn]);
  

  // const endRound = () => {
  //   if (teamTurn === "blue") {
  //     setGreenTeamPts((prev) => prev + 1);
  //   } else {
  //     setBlueTeamPts((prev) => prev + 1);
  //   }


  //   // Check for win condition
  //   if (blueTeamPts === 5 || greenTeamPts === 5) {
  //     setWinCondition(true);
  //     alert(`${blueTeamPts === 5 ? "Blue Team" : "Green Team"} Wins!`);
  //   } else {
  //     startRound();
  //   }
  // };

  const getBluePiecePosition = (score) => {
    return predefinedBluePositions[score];
  };

  const getGreenPiecePosition = (score) => {
    return predefinedGreenPositions[score];
  };

  //New Section for updated game frontend code with endpoint calls

  const joinRoom = async (e) => {
    e.preventDefault();  // Prevents page refresh/navigation
    try {
      const response = await fetch('/api/game/createOrJoinRoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username: userName }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      setGameState(data.gameState);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const setTeams = async () => {
    try {
      const response = await fetch('/api/game/setTeams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode })  // Sending the current room code
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json(); // Parse response JSON
      setGameState(data.gameState); // Update game state with the new teams
  
      console.log("Teams set successfully:", data.gameState);
    } catch (error) {
      console.error("Error setting teams:", error);
    }
  };

  const playGame = async () => {
    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log("Game started successfully:", data);

    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  //set guess endpoint
  const handleKeyPressforWord = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!roomCode || !userGuess.trim()) {
          console.warn("Room code or guessed word is missing.");
          return;
      }
      console.log("Submitting guess:", { roomCode, guessedWord: userGuess });
      try {
          const response = await fetch('/api/game/guessWord', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomCode, guessedWord: userGuess, username: userName })
          });

          if (!response.ok) {
              throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();
          console.log("Guess submitted:", data);

          setGameState(data);
          setBlueTeam(data.blueTeam);
          setGreenTeam(data.greenTeam);

      } catch (error) {
          console.error("Error submitting guess:", error);
      }

      // Reset input field after submitting
      setUserGuess("");
  }
  }


  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/game/state?roomCode=${roomCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
  
        if (data) {
          setGameState(data);
          setBlueTeam(data.blueTeam || {}); 
          setGreenTeam(data.greenTeam || {});
          setTimer(data.timer);
          //will need to change below once websocket is working, description response is getting reset after each round and with how I'm showing the UI changes right now it doesn't persist against gameState changes. Basically it vanishes
          if (data.describerResponse && data.describerResponse !== "") {
            setDescriberResponse(data.describerResponse);
          }
          setRandomWord(data.randomWord);
          setCurrentDescriber(data.currentDescriber);
          setBlueTeamPts(data.blueTeamPts);
          setGreenTeamPts(data.greenTeamPts);
          setTeamTurn(data.teamTurn);
        }
      } catch (error) {
        console.error("Error fetching game state:", error);
      }
    };
  
    // Poll game state every second
    const interval = setInterval(fetchGameState, 3000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [roomCode]);
  
  


  useEffect(() => {
    const bluePiecePosition = getBluePiecePosition(blueTeamPts);
    const bluePiece = document.querySelector('.blue-piece');
    if (bluePiece && bluePiecePosition) {
      bluePiece.style.left = bluePiecePosition.left;
      bluePiece.style.top = bluePiecePosition.top;
    }
  }, [blueTeamPts]);


  useEffect(() => {
    const greenPiecePosition = getGreenPiecePosition(greenTeamPts);
    const greenPiece = document.querySelector('.green-piece');
    if (greenPiece && greenPiecePosition) {
      greenPiece.style.left = greenPiecePosition.left;
      greenPiece.style.top = greenPiecePosition.top;
    }
  }, [greenTeamPts]);


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
              {blueTeam && Object.keys(blueTeam).length > 0 && (
                <>
                  {Object.entries(blueTeam).map(([username, player], index) => (
                    <tr key={index} className={player.turn === "Describer" ? "highlight" : ""}>
                      <td>{username}</td>
                      <td>{player.turn || ""}</td>
                      <td>{player.guessedWord || ""}</td>
                    </tr>
                  ))}
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
          <form onSubmit={joinRoom} className="w-75 pb-1">
          <div className="d-flex align-items-center">
            <label htmlFor="room-code"></label>
            <input
              type="text"
              id="room-code"
              className="form-control me-2"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            /> 
            <button type="submit" className="btn btn-outline-secondary h-50 py-0">Join Room</button>
            </div>
          </form>
          <div>
          <button className="btn btn-primary w100 me-2 " onClick={setTeams }>Set Teams!</button>
          <button className="btn btn-success w100" onClick={playGame }>Play Game!</button>
          </div>
          <form action="#" method="post" className="w-50 mt-2">
            <input
              type="text"
              id="GuessWordBox"
              className="form-control mb-3"
              placeholder="Guess the Word!"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyDown={handleKeyPressforWord}
              
            />
          </form>
          <form action="#" method="post" className="w-100">
          <textarea
              id="DescriptionWordBox"
              className="form-control mb-2 py-3"
              rows="4"
              readOnly
              value={
                currentDescriber && currentDescriber.username
                  ? `${currentDescriber.username} is describing: ${describerResponse}`
                  : "Waiting for describer..."
              }
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
                {greenTeam && Object.keys(greenTeam).length > 0 && (
                  <>
                    {Object.entries(greenTeam).map(([username, player], index) => (
                      <tr key={index} className={player.turn === "Describer" ? "highlight" : ""}>
                        <td>{username}</td>
                        <td>{player.turn || ""}</td>
                        <td>{player.guessedWord || ""}</td>
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