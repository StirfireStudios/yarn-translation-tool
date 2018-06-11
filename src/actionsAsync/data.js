import { Parser as YarnParser } from 'jacquard-yarnparser';
import ShortID from 'shortid';

import * as DataActions from '../actions/data';

import excelWriter from '../excelWriter';
import taggedYarnWriter from '../taggedYarnWriter';
import unrealWriter from '../unrealCsvWriter';
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

function partsOf(filepath) {
  const extension = Path.extname(filepath)
  return {
    full: filepath,
    fileName: Path.basename(filepath),
    extension,
    base: Path.basename(filepath, extension),
    dir: Path.dirname(filepath),
  }
}

export function SaveData(key, filepath, results, yarn) {
  DataActions.SaveStarted(key);
  setTimeout(() => {
    const fileParts = partsOf(filepath);
    const excelName = `${fileParts.base}.xlsx`;
    const excelfullPath = Path.join(fileParts.dir, excelName);
    fs.writeFileSync(excelfullPath, excelWriter(results), {encoding: 'binary'});
    const csvName = `${fileParts.base}.csv`;
    const csvfullPath = Path.join(fileParts.dir, csvName);
    fs.writeFileSync(csvfullPath, unrealWriter(results), {encoding: 'utf-8'});
    const jsonName = `${fileParts.base}.recording.json`;
    const jsonFullPath = Path.join(fileParts.dir, jsonName);
    fs.writeFileSync(jsonFullPath, JSON.stringify(results), {encoding: 'utf-8'});
    const yarnName = `${fileParts.base}.tagged.yarn.txt`;
    const yarnFullPath = Path.join(fileParts.dir, yarnName);
    fs.writeFileSync(yarnFullPath, taggedYarnWriter(yarn, results), {encoding: 'utf-8'});

  },0);
}
