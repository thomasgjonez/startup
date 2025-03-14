import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authState';

export function CreateAccount({ onAuthChange }) {
  const [signupUser, setSignupUser] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUser,
          email: signupEmail,
          password: signupPassword,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Error creating account');
        return;
      }
      const data = await response.json();
      localStorage.setItem('username', signupUser);
      onAuthChange(data.username, AuthState.Authenticated);
      navigate('/game');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-box w-75 p-4 rounded shadow">
      <h2>Create Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSignup}>
        <div className="form-group mb">
          <label htmlFor="signup-username"></label>
          <input
            type="text"
            id="signup-username"
            className="form-control"
            placeholder="Enter your username"
            required
            value={signupUser}
            onChange={(e) => setSignupUser(e.target.value)}
          />
        </div>
        <div className="form-group mb">
          <label htmlFor="signup-email"></label>
          <input
            type="email"
            id="signup-email"
            className="form-control"
            placeholder="Enter your email"
            required
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="signup-password"></label>
          <input
            type="password"
            id="signup-password"
            className="form-control"
            placeholder="Enter your password"
            required
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Sign Up
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <NavLink to="/login">Log in here</NavLink>
      </p>
    </div>
  );
}
