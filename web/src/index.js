// System imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CSS import
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Entry point of the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
