import { Parser as YarnParser } from 'jacquard-yarnparser';
import ShortID from 'shortid';

import * as DataActions from '../actions/data';

import yarnProcessor from '../yarnProcessor';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

export function LoadFile(path) {
  const id = ShortID.generate();
  DataActions.LoadStarted(id, path);

  try {
    fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
      if (err) {
        DataActions.ErrorLoading(id, err);
      } else {
        DataActions.LoadComplete(id, data);
      }
    })
  } catch(err) {
    DataActions.ErrorLoading(id, err);
    return;
  }
}

export function Parse(key, data) {
  DataActions.ParseStart(key);
  // avoid Zalgo
  setTimeout(() => {
    const parser = new YarnParser({dialogSegmentPerLine: false});
    parser.parse(data);
    if (parser.errors > 0) {
      console.log("ERRORS");
      console.error(parser.errors);
    } else {
      yarnProcessor(parser);
    }
  }, 0);
}