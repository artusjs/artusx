import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App.tsx';
import './index.css';

export function render(url?: string) {
  console.log('rendering', url);
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
