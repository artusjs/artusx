import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { useMeasure } from './hooks/useMeasure';
import Rooter from './rooter';
import './global.css';

const container = document.getElementById('root');

const Root: React.FC<{}> = () => {
  useMeasure('reactMeasure', 'html.render', 'react.root');
  return <Rooter />;
};

if (import.meta.hot || !container?.innerText) {
  performance.mark('react.createRoot');
  const root = createRoot(container!);
  root.render(<Root />);
} else {
  performance.mark('react.hydrateRoot');
  hydrateRoot(container!, <Root />);
}
