import React, { useState, useEffect, useRef} from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import "./main.css"

export default function MainLayout({ userName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatBoxRef = useRef(null);

const addMessage = async () => {
    try {
      const response = await fetch('/api/main/addMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, message: inputMessage }),
      });
      console.log(userName);
      console.log(inputMessage);
  
      if (!response.ok) throw new Error('Failed to send message');
  
      setInputMessage(""); // Clear input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/main/getMessage');
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, ...data]); 
      //I have a server function that will clear the chat so its in sync for everyone
      //await fetch('/api/main/clearChat', {method: 'DELETE'}); //clears chat array so that messages aren't printing over and over again
      } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const interval = setInterval(fetchMessages, 5000);
  return () => clearInterval(interval);
}, []);


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
