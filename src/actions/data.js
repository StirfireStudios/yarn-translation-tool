import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started');
export const LoadComplete = createAction('Data - Load completed', (fileName, handle) => ({fileName, handle}));
