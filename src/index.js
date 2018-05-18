import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import assignActions from './actions/assign';
import App from './App';
import createStore from './store'
import registerServiceWorker from './registerServiceWorker';

const store = createStore();
assignActions(store);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
