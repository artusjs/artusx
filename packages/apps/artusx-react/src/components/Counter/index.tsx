import { useState } from 'react';
import { useMeasure } from '../../hooks/useMeasure';

export default function Counter() {
  const [count, setCount] = useState(0);
  useMeasure('counterMeasure', 'root.render', 'counter.render');

  return (
    <div className="card">
      <button role="button" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}
