import React from 'react';
import './rules.css';

export function Rules() {
  return (
    <main>
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-50 p-4 bg-light border rounded text-center mt-5">
            <h1 className="Rules">
                Rules
            </h1>
                <div>
                    <p>
                        Catch Phrase is an online game where each team takes turns guessing a word based off of a fellow teamates description. 
                        When the buzzer sounds, whatever team is trying to guess a word loses and the opposing team scores a point and moves their team piece ahead one square.
                        The game continues until one team has reached the end.
                    </p>
                    <p>When providing a description for the word one may not:
                        <li>Mention the word</li>
                        <li>Say what letters it starts with</li>
                        <li>Say it ryhmes with...</li>
                    </p>
                    <p>
                        Have Fun!
                    </p>
                </div>
            </div>
        </div>
    </main>
  );
}