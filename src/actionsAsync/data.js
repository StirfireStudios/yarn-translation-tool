import { Parser as YarnParser } from 'jacquard-yarnparser';
import ShortID from 'shortid';
import XLSX from 'xlsx';

import * as DataActions from '../actions/data';

import yarnProcessor from '../yarnProcessor';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const Path = electron.remote.require('path');

const wbOpts = {
  bookType:'xlsx', 
  bookSST:true, 
  compression: true, 
  type:'binary',
};

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

export function SaveCSV(key, filepath, results) {
  DataActions.SaveStarted(key);
  // avoid Zalgo
  setTimeout(() => {
    const wb = XLSX.utils.book_new();
    const recordingData = XLSX.utils.aoa_to_sheet(results.recording);
    XLSX.utils.book_append_sheet(wb, recordingData, "Recording Info");
    const translationData = XLSX.utils.aoa_to_sheet(results.translation);
    XLSX.utils.book_append_sheet(wb, translationData, "Translation Info");
    const processingData = XLSX.utils.aoa_to_sheet(results.processing);
    XLSX.utils.book_append_sheet(wb, processingData, "Processing Info");
    const fileParts = partsOf(filepath);
    const shortName = `${fileParts.base}.xlsx`;
    const fullPath = Path.join(fileParts.dir, shortName);
    const xlsdata = XLSX.write(wb, wbOpts);
    fs.writeFileSync(fullPath, xlsdata, {encoding: 'binary'});
  },0);
}
