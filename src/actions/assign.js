import { assignAll } from 'redux-act';

const actions = [];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
