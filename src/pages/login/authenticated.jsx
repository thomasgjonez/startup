import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';


export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
      });
  }

  return (
   <div>
    <h1>Welcome to CatchPhrase</h1>
    <h3>{props.userName}</h3>
    <Button className="btn btn-success w100" size="lg" onClick={() => navigate('/game')} >
      Play
    </Button>
    <Button variant="secondary" size="lg" onClick={() => logout()} >
      Logout
    </Button>
    </div>
  );
}