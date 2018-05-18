import { createReducer } from 'redux-act';

import * as DataActions from '../actions/data';

function dupeArray(array) {
  return array.map((item) => (item));
}

export default createReducer({
  [DataActions.LoadStarted]: (state, filename) => {
    const newOutstanding = dupeArray(state.outstandingLoads);
    newOutstanding.push(filename);
    const newErrors = Object.assign({}, state.errors);
    delete(newErrors[filename]);
    return {
      ...state,
      outstandingLoads: newOutstanding,
      errors: newErrors,
    }
  },  
},{
  outstandingLoads: [],
  yarnFiles: [],
  errors: {},
});