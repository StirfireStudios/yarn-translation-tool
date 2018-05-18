import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started', (id, path) => ({id, path}));
export const LoadComplete = createAction('Data - Load completed', (id, data) => ({id, data}));
export const UnloadFile = createAction('Data - Remove file');
export const ErrorLoading = createAction('Data - Error Loading File', (id, error) => ({id, error}));

export const ParseStart = createAction('Data - Parse Started');