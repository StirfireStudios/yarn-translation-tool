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
    }
    return {
      ...state,
      fileState: newFileState,
    }
  },
  [DataActions.LoadComplete]: (state, data) => {
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
  [DataActions.ParseStart]: (state, id) => {
    const newFileState = Object.assign({}, state.fileState);
    newFileState[id].parsing = true;
    return {
      ...state,
      fileState: newFileState,
    }    
  },  
},{
  fileState: {},
});