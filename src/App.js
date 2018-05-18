import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ElectronProvider } from 'react-electron-menu';

import Menu from './components/Menu';

const electron = window.require('electron');

class App extends Component {
  render() {
    return (
      <ReduxProvider store={this.props.store}>
        <ElectronProvider electron={electron}>
          <div className="App">
            <Menu/>
            <header className="App-header">
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to.
            </p>
          </div> 
        </ElectronProvider>
      </ReduxProvider>
    );
  }
}

export default App;
