import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started', (id, path) => ({id, path}));
export const LoadCompleted = createAction('Data - Load completed', (id, data) => ({id, data}));
export const UnloadFile = createAction('Data - Remove file');
export const ErrorLoading = createAction('Data - Error Loading File', (id, error) => ({id, error}));

export const ParseStarted = createAction('Data - Parse Started');
export const ParseCompleted = createAction('Data - Parse completed', (id, results) => ({id, results})); 
export const ParseErrors = createAction('Data - Parsing errors', (id, errors) => (id, errors));

export const SaveStarted = createAction('Data - Save Started');
export const SaveCompleted = createAction('Data - Save completed'); 
export const SaveErrors = createAction('Data - Save errors', (id, errors) => (id, errors));
