import React from 'react';
import { NavLink } from 'react-router-dom';

export function CreateAccount() {
  return (
    <div className="login-box w-75 p-4 rounded shadow">
      <h2>Create Account</h2>
      <form id="signup-form" action="placeholder" method="POST">
        <div className="form-group mb-3">
          <label htmlFor="signup-username">Username</label>
          <input type="text" id="signup-username" placeholder="Enter your username: " />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="signup-email">Email</label>
          <input type="email" id="signup-email" placeholder="Enter your email: " />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" placeholder="Enter your password: " />
        </div>
        <button className="btn btn-primary w-100 mt-2" type="submit">Sign Up</button>
      </form>
      <p className="mt-3">
        Already have an account? <NavLink to="/home/login" id="switch-to-login">Log in here</NavLink>
      </p>
    </div>
  );
}
