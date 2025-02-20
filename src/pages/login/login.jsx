import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthState } from './authState';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login({ userName, authState, onAuthChange }) {
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // For now, we simulate checking credentials (could be expanded later)
    const storedUser = JSON.parse(localStorage.getItem('auth'));

    if (storedUser && storedUser.username === loginUser && storedUser.password === loginPassword) {
      onAuthChange(loginUser, AuthState.Authenticated);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-box w-75 p-4 rounded shadow">
      {authState === AuthState.Authenticated ? (
        <Authenticated userName={userName} onLogout={() => onAuthChange('', AuthState.Unauthenticated)} />
      ) : (
        <>
          <h2>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="login-user">Username</label>
              <input
                type="text"
                id="login-user"
                className="form-control"
                placeholder="Enter your username"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                className="form-control"
                placeholder="Enter your password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
          <p className="mt-3">
            Don't have an account? <NavLink to="/create-account">Create your account.</NavLink>
          </p>
          <NavLink to="/game" className="btn btn-success w-100 mt-2">Play Game!</NavLink>
        </>
      )}
    </div>
  );
}
