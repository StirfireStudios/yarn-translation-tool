import { assignAll } from 'redux-act';

import * as Data from './data'

const actions = [Data];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
