import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ElectronProvider } from 'react-electron-menu';

import Menu from './components/Menu';
import FileInfo from './components/FileInfo';
import VersionInfo from './components/VersionInfo';

import './App.css';

const electron = window.require('electron');

class App extends Component {
  render() {
    return (
      <ReduxProvider store={this.props.store}>
        <ElectronProvider electron={electron}>
          <div className="App">
            <Menu/>
            <FileInfo/>
            <VersionInfo/>
          </div>
        </ElectronProvider>
      </ReduxProvider>
    );
  }
}

export default App;
