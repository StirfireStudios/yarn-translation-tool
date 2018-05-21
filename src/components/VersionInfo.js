import React, { Component } from 'react';
 
import Package from '../../package.json';

export default class VersionInfo extends Component {
  render() {
    return (
      <div className="version-info">
        Translation Tool Helper Version: {Package.version}
      </div>
    );
  }
}

