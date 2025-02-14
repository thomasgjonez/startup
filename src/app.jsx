import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import { Rules } from './pages/rules/rules';
import { Game } from './pages/game/game';
import { HomeLayout } from './Layout/HomeLayout';
import { Login }  from './pages/login/login';
import { CreateAccount }from './pages/create-account/create-account';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/game" element={<Game />} />
          <Route path="/rules" element={<Rules />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
