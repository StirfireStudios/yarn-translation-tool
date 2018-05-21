import { Parser as YarnParser } from 'jacquard-yarnparser';
import ShortID from 'shortid';
import CsvWriter from 'csv-write-stream';

import * as DataActions from '../actions/data';

import yarnProcessor from '../yarnProcessor';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const Path = electron.remote.require('path');

export function LoadFile(path) {
  const id = ShortID.generate();
  DataActions.LoadStarted(id, path);

  try {
    fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
      if (err) {
        DataActions.ErrorLoading(id, err);
      } else {
        DataActions.LoadCompleted(id, data);
      }
    })
  } catch(err) {
    DataActions.ErrorLoading(id, err);
    return;
  }
}

export function Parse(key, data) {
  DataActions.ParseStarted(key);
  // avoid Zalgo
  setTimeout(() => {
    const parser = new YarnParser({dialogSegmentPerLine: false});
    parser.parse(data);
    if (parser.errors > 0) {
      console.log("ERRORS");
      console.error(parser.errors);
    } else {
      const results = yarnProcessor(parser);
      DataActions.ParseCompleted(key, results);
    }
  }, 0);
}

function csvPathFor(filepath) {
  const extension = Path.extname(filepath);
  return filepath.substring(0, filepath.length - extension.length) + ".csv";
}

export function SaveCSV(key, filepath, results) {
  DataActions.SaveStarted(key);
  // avoid Zalgo
  setTimeout(() => {
    const writer = CsvWriter({headers: results.headers});
    writer.pipe(fs.createWriteStream(csvPathFor(filepath)));
    results.forEach(result => {
      writer.write(result);
    });
    writer.end();
  },0);
}
