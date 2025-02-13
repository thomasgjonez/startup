import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="vh-100 d-flex flex-column">
  <header className="custom-header p-3">
    <div className="container-fluid d-flex justify-content-between align-items-center ">
        <h1 className="GameTitle">CatchPhrase</h1>
        
        <nav className="Navigation">
            <div className="d-flex gap-3">
                <button onclick="location.href='Index.html'" className="btn ">Home</button>
                <button onclick="location.href='Game.html'" className="btn ">Game</button>
                <button onclick="location.href='Rules.html'" className="btn ">Rules</button>
                <h3 className="UserName">UserName</h3>
            </div>
        </nav>
    </div>
</header>
<main>App components go here</main>
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
  );
}