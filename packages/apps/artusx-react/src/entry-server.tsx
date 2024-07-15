import ReactDOMServer from 'react-dom/server';
import Rooter from './rooter';
import './global.css';

export function render(url?: string) {
  console.log('rendering', url);
  return ReactDOMServer.renderToString(<Rooter />);
}
