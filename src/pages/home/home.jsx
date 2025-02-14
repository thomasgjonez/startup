import React from 'react';
import "./home.css"
import { Outlet, useNavigate } from 'react-router-dom';

export function Home() {
const navigate = useNavigate();
  return (
    <div className="main">
    <main className="d-flex flex-column flex-md-row w-100 h-100">
        <div className="left col-md-6 d-flex flex-column justify-content-center text-center text-md-start">
            <h1> <a href="https://github.com/thomasgjonez/startup.git"> My github repo link</a></h1>
            <h1 className="GameTitle">Catch<br />Phrase</h1>
            <h3 className="Slogan">Think Fast, Talk Faster!</h3>
        </div>
    
        
        <div className="right col-md-6 d-flex flex-column justify-content-center align-items-center">
        <Outlet /> {/* This will render Login or CreateAccount */}
        <button className="btn btn-success w-50 mt-2" onClick={() => navigate('/game')}>Play Game!</button>
        </div>
        
    </main>
    </div>
  );
}
