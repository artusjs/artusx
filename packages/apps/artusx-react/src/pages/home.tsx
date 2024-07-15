import { useMeasure } from '../hooks/useMeasure';
import Counter from '../components/Counter';

function Home() {
  useMeasure('homeMeasure', 'root.render', 'home.render');

  return (
    <div>
      <h1>Home</h1>
      <Counter />
    </div>
  );
}

export default Home;
