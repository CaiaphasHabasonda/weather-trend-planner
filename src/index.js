import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';   // <-- notice the .jsx extension
import './index.css';          // optional, only if you have styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
