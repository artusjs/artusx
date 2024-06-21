import viteLogo from './assets/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';

import Counter from './components/Counter';
import ReloadPrompt from './components/ReloadPrompt';

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + PWA, v1.2</h1>
      <Counter />
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <ReloadPrompt />
    </>
  );
}

export default App;
