import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import { Rules } from './pages/rules/rules';
import { Game } from './pages/game/game';
import { Home } from './pages/home/home';
import { Login }  from './pages/Auth/login/login';
import { CreateAccount }from './pages/Auth/create-account/create-account';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Game />} />
          <Route path="/game" element={<Game />} />
          <Route path="/rules" element={<Rules />} />
        </Route>

        {/* Routes that use AuthLayout (NO Header/Footer) */}
        <Route path="/home" element={<Home />}>
          <Route index element={<Navigate to="/home/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
