import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export function Unauthenticated({onLogin}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
      
    if (!userName || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Error logging in');
        return;
      }

      const data = await response.json();
      localStorage.setItem("auth", JSON.stringify({ loggedIn: true, username: data.username }));
      onLogin(data.username);
      navigate('/game');
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div>
      <h2>Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
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
    </div>
  );
}