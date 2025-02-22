import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import { Rules } from './pages/rules/rules';
import { Game } from './pages/game/game';
import { HomeLayout } from './Layout/HomeLayout';
import { Login }  from './pages/login/login';
import { CreateAccount }from './pages/create-account/create-account';
import { AuthState } from './pages/login/authState';

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState("");

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth?.loggedIn) {
      setAuthState(AuthState.Authenticated);
      setUserName(storedAuth.username);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);
  // Handles login/logout updates
  const handleAuthChange = (userName, newAuthState) => {
    setUserName(userName);
    setAuthState(newAuthState);
    localStorage.setItem(
      "auth",
      JSON.stringify({ loggedIn: newAuthState === AuthState.Authenticated, username: userName })
    );
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Home Layout Routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login userName={userName} authState={authState} onAuthChange={handleAuthChange} />} />
          <Route path="create-account" element={<CreateAccount onAuthChange={handleAuthChange} />} />
        </Route>

        {/* Main Layout Routes */}
        <Route element={<MainLayout userName={userName} />}>
          <Route path="/game" element={<Game userName={userName}/>} />
          <Route path="/rules" element={<Rules />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
