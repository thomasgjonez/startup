import React, { useState } from 'react';
import './game.css'

export function Game() {
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
                <td id="UserName">Johnsmith_2</td>
                <td id="Turn">Not Yet</td>
                <td id="UserNameWordGuessed">N/A</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Game Controls Section */}
        <section className="col-md-4 d-flex flex-column justify-content-center align-items-center">
          <h2>Room Code: </h2>
          <form action="#" method="POST" className="w-75 pb-5">
            <label htmlFor="room-code"></label>
            <input
              type="text"
              id="room-code"
              className="form-control mb-2"
              value="Enter Room Code"
              readOnly
            />
          </form>
          <form action="#" method="post" className="w-50">
            <input
              type="text"
              id="GuessWordBox"
              className="form-control mb-3"
              value="Guess the Word!"
              readOnly
            />
          </form>
          <form action="#" method="post" className="w-50">
            <textarea
              id="DescriptionWordBox"
              className="form-control mb-2 py-3"
              rows="4"
              readOnly
            >
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
                <td id="UserNameWordGuessed">Banana</td>
              </tr>
              <tr>
                <td id="UserName">Johnsmith_20</td>
                <td id="Turn">Not Yet</td>
                <td id="UserNameWordGuessed">Orange</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}