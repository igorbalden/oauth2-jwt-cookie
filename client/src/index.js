import React from 'react';
import ReactDOM from 'react-dom';
import { AuthState } from './context/authContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <App />
    </AuthState>
  </React.StrictMode>,
  document.getElementById('root')
);
