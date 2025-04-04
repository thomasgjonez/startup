import React, { useState, useEffect, useRef} from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import "./main.css"

export default function MainLayout({ userName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatBoxRef = useRef(null);

  // Set up the WebSocket connection
  const socketRef = useRef(null);

  // Connect to the WebSocket server
  useEffect(() => {
    // let port = window.location.port;
    // const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    // this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    socketRef.current = new WebSocket('ws://localhost:4000');

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    // Listen for incoming messages from the WebSocket server
    socketRef.current.onmessage = async (event) => {
      const text = await event.data.text();
      const newMessage = JSON.parse(text);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

const addMessage = async () => {
  if (!inputMessage.trim()) return;

  const message = {
    username: userName,
    message: inputMessage,
    type: 'chat',
  };

  // Send the message to WebSocket server
  socketRef.current.send(JSON.stringify(message));

  //adds message so that the user who sent it can see it too
  setMessages((prevMessages) => [...prevMessages, message]);

  setInputMessage("");
  };

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
            <p key={index}><strong>{msg.username}: </strong> {msg.message}</p>
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
          onKeyDown={(e) => e.key === "Enter" && addMessage()}
          />
          <button id="sendMessageButton" className="btn btn-primary mt-2" onClick={addMessage}>Send</button>
        </div>
      </footer>
    </div>
  );
}
