import { createReducer } from 'redux-act';

import * as DataActions from '../actions/data';

export default createReducer({
  [DataActions.LoadStarted]: (state, data) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[data.id] = {
      path: data.path,
      loading: true,
      parsing: false,
      error: null,
      data: null,
      parseResults: null,
    }
    return {
      ...state,
      fileState: newFileState,
    }
  },
  [DataActions.LoadCompleted]: (state, data) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[data.id].loading = false;
    newFileState[data.id].data = data.data;
    return {
      ...state,
      fileState: newFileState,
    }    
  },
  [DataActions.UnloadFile]: (state, id) => {
    const newFileState = Object.assign({}, state.fileState);
    delete(newFileState[id]);
    return {
      ...state,
      fileState: newFileState,
    }    
  },
  [DataActions.ErrorLoading]: (state, data) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[data.id].error = data.error;
    return {
      ...state,
      fileState: newFileState,
    }    
  },
  [DataActions.ParseStarted]: (state, id) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[id].parsing = true;
    newFileState[id].parseResults = null;
    return {
      ...state,
      fileState: newFileState,
    }    
  },  
  [DataActions.ParseCompleted]: (state, data) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[data.id].parsing = false;
    newFileState[data.id].parseResults = data.results;
    return {
      ...state,
      fileState: newFileState,
    }    
  },
},{
  fileState: {},
});
