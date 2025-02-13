import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Rules } from './rules/rules';
import { Game } from './game/game';
import { Home } from './Home-page/home'

export default function App() {
  return (
    <BrowserRouter>
    <div className="vh-100 d-flex flex-column">
  <header className="custom-header p-3">
    <div className="container-fluid d-flex justify-content-between align-items-center ">
        <h1 className="GameTitle">CatchPhrase</h1>
        
        <nav className="Navigation">
            <div className="d-flex gap-3">
                <NavLink to="/home" className="btn" >Home</NavLink>
                <NavLink to="/game" className="btn">Game</NavLink>
                <NavLink to="/rules" className="btn" >Rules</NavLink>
                <h3 className="UserName">UserName</h3>
            </div>
        </nav>
    </div>
</header>

<Routes>
    <Route path="/" element={<Game />} /> {/* Default to Game */}
    <Route path="/home" element={<Home />} />
    <Route path="/game" element={<Game />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="*" element={<NotFound />} />
</Routes>

<footer className="text-center py-3 bg-light">
      <h2>Live Chat</h2>
      <div className="chatBox border rounded p-3 bg-white shadow-sm w-50 mx-auto">
          <p>Basic box which will display chat from Websocket</p>
      </div>
      <div className="mt-2">
          <input type="text" id="messageInput" className="form-control w-50 mx-auto" placeholder="Type a message"/>
          <button id="sendMessageButton" className="btn btn-primary mt-2">Send</button>
      </div>
  </footer>
</div>
</BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}