import React, { Component } from 'react';
 
import Package from '../../package.json';

export default function VersionInfo(props) {
  return (
    <div id="version-info">
      Translation Tool Helper Version: {Package.version}
    </div>
  );
}

