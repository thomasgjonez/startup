import React from 'react';
import { NavLink } from 'react-router-dom';

export function Login() {
  return (
    <div className="login-box w-75 p-4 rounded shadow">
      <h2>Login</h2>
      <form>
        <div className="form-group mb-3">
          <label htmlFor="login-user">Username</label>
          <input type="text" id="login-user" className="form-control" placeholder="Enter your username" required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="login-password">Password</label>
          <input type="password" id="login-password" className="form-control" placeholder="Enter your password" required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <NavLink to="/create-account">Create your account.</NavLink>
      </p>
      <NavLink to="/game" className="btn btn-success w-100 mt-2" >Play Game!</NavLink>
    </div>
  );
}