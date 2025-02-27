import React, { useState, useEffect, useRef} from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import "./main.css"

export default function MainLayout({ userName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const username = userName;
  const chatBoxRef = useRef(null);

  const addMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages((prev) => [...prev, { username, text: inputMessage }]);
      setInputMessage("");
      //Mock messages
      setTimeout(() => {
      setMessages((prev) => [...prev, { username: "Johnsmith_15", text: "what a cool insight" }]);
      }, 2000 )
      setTimeout(() => {
      setMessages((prev) => [...prev, { username: "Johnsmith_1", text: "I love CatchPhrase" }]);
      }, 4000 )
    }
  };
  setInterval(() => {
    // This will be replaced with WebSocket messages
    const userName = `User-${Math.floor(Math.random() * 100)}`;
    setMessages((prev) => [...prev, { username: userName, text: "Hi!" }]);;
  }, 5000);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    
    <div className="vh-100 d-flex flex-column">
      <header className="custom-header p-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="GameTitle">CatchPhrase</h1>
          <nav className="Navigation">
            <div className="d-flex gap-3">
              <NavLink to="/" className="btn">Home</NavLink>
              <NavLink to="/game" className="btn">Game</NavLink>
              <NavLink to="/rules" className="btn">Rules</NavLink>
              {userName && <div className="playerName">{userName}</div>}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow-1 d-flex">
        <Outlet />
      </main>

      <footer className="text-center py-3 bg-light">
        <h2>Live Chat</h2>
        <div ref={chatBoxRef} className="chatBox border rounded p-3 bg-white shadow-sm w-50 mx-auto "style={{ maxHeight: "100px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <p key={index}><strong>{msg.username}: </strong> {msg.text}</p>
          ))}

        </div>
        <div className="mt-2">
          <input 
          type="text" 
          id="messageInput" 
          className="form-control w-50 mx-auto" 
          placeholder="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          />
          <button id="sendMessageButton" className="btn btn-primary mt-2" onClick={addMessage}>Send</button>
        </div>
      </footer>
    </div>
  );
}
