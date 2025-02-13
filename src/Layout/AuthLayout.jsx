import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="main">
      <Outlet /> {/* This swaps between Login and Create Account */}
    </div>
  );
}