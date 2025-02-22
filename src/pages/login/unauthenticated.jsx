import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export function Unauthenticated(props) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);

  async function loginUser() {
    if (!userName || !password) {
        setDisplayError("Username and password are required.");
        return;
      }
    
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Check if the username exists
      if (!storedUsers.includes(userName)) {
        setDisplayError("Username not found.");
        return;
      }
    
      // Save login state
      localStorage.setItem("auth", JSON.stringify({ loggedIn: true, username: userName }));
    
      // Call login handler
      props.onLogin(userName);
  }

  return (
    <div>
      <h2>Login</h2>

      {displayError && <div className="alert alert-danger">{displayError}</div>}

      <form onSubmit={(e) => { e.preventDefault(); loginUser(); }}>
        <div className="form-group">
          <label htmlFor="login-user"></label>
          <input
            type="text"
            id="login-user"
            className="form-control"
            placeholder="Enter your username"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="login-password"></label>
          <input
            type="password"
            id="login-password"
            className="form-control"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="primary" className="w-100" type="submit">
          Login
        </Button>
      </form>

      <p className="mt-3">
        Don't have an account? <NavLink to="/create-account">Create your account.</NavLink>
      </p>

      <NavLink to="/game" className="btn btn-success w-100 mt-2">Play Game!</NavLink>
    </div>
  );
}