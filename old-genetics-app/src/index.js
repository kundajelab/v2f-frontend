import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';

import '@fontsource/inter';
import './index.css';

import App from './App';
import config from './config';
import { unregister } from './registerServiceWorker';

if (config.googleTagManagerID) {
  TagManager.initialize({ gtmId: config.googleTagManagerID });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// disable service worker
unregister();
