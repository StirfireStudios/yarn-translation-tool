import { connect } from 'react-redux';
import React, { Component } from 'react';

import * as DataActions from '../actions/data';
import * as DataAsyncActions from '../actionsAsync/data';


function processFile(data, event) {
  DataAsyncActions.Parse(data.key, data.data);
  event.preventDefault();
}

function SaveData(data, event) {
  DataAsyncActions.SaveData(data.key, data.path, data.parseResults);
  event.preventDefault();
}

function unloadFile(data, event) {
  DataActions.UnloadFile(data.key);
  event.preventDefault();
}

function renderMessage(data) {
  if (data.error !== null) {
    return <span key="error" className="error">{data.error}</span>;
  }
  if (data.loading) {
    return <span key="loading" className="loading">Loading file: </span>;
  }
  if (data.parsing) {
    return <span key="parsing" className="parsing">Parsing file: </span>;    
  }
  if (data.saving) {
    return <span key="saving" className="saving">Saving file: </span>;      
  }

  let firstButton = null;
  if (data.parseResults === null) {
    firstButton = <button key="process" onClick={processFile.bind(null, data)}>Process</button>
  } else {
    firstButton = <button key="save" onClick={SaveData.bind(null, data)}>Save</button>
  }

  return (
    <div key="actions">
      {firstButton}
      <button key="unload" onClick={unloadFile.bind(null, data)}>Unload</button>
    </div>
  );
}

function renderFileInfo(data) {
  return (
    <div key={data.key}>
      {renderMessage(data)}
      <span key="path">{data.path}</span>
    </div>
  )
}

class FileInfo extends Component {
  render() {
    if (!this.props.anyFiles) {
      return (
        <div>Please load some yarn files!</div>
      );
    }

    const fileInfos = [];
    for(let data of this.props.fileInfo) {
      fileInfos.push(renderFileInfo(data));
    }

    return (
      <div>
        {fileInfos}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const fileInfo = [];
  for(let id of Object.keys(state.Data.fileState)) {
    fileInfo.push({
      ...state.Data.fileState[id],
      key: id,
    });
  }
  return {
    fileInfo: fileInfo,
    anyFiles: Object.keys(fileInfo).length > 0,
  }
}

export default connect(mapStateToProps)(FileInfo);
