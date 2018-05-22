import XLSX from 'xlsx';

import * as Util from './util'

const defaults = Object.freeze({
  "Words Per Second": 1.8,
});

/*Complete Word Count
Number of lines
Number of segments
Number of death lines
Total delivery time (words per second total)
Total Delivery time (in minutes)
Total delivery time (in hours)*/

function valueForRange(range) {
  const startRef = Util.getReferenceFor(range.firstRow, range.col);
  const endRef =  Util.getReferenceFor(range.finalRow, range.col);
  if (range.sheetName != null) {
    return `'${range.sheetName}'!${startRef}:${endRef}`;
  } else {
    return `${startRef}:${endRef}`;
  }
}

function formulaForRange(range, funcName) {
  return `${funcName}(${valueForRange(range)})`;
}

export function generate(wordCountRef, lineRef, lineTextRef, lengthRef) {
  const sheet = Util.setupSheet(["Name", "Value"]);
  sheet['!cols'][1].wch = 10;
  sheet['!cols'].push({wch: 10});
  sheet.lastWrite = {row: 0, col: 1};
  Util.appendDataToSheet(sheet, ["Complete Word Count"]);
  Util.appendFormulaToSheet(sheet, formulaForRange(wordCountRef, "SUM"));
  Util.appendDataToSheet(sheet, ["Number of Segments"]);
  Util.appendFormulaToSheet(sheet, formulaForRange(wordCountRef, "COUNT"));
  Util.appendDataToSheet(sheet, ["Number of Lines"]);
  Util.appendFormulaToSheet(sheet, formulaForRange(lineRef, "SUM"));
  Util.appendDataToSheet(sheet, ["Number of Death Lines"]);
  Util.appendFormulaToSheet(sheet, `COUNTIF(${valueForRange(lineTextRef)},"*ya die*")`);
  Util.appendDataToSheet(sheet, ["Total Delivery Time", "", "(in seconds)"]);
  sheet.lastWrite.col = 0;
  Util.appendFormulaToSheet(sheet, formulaForRange(lengthRef, "SUM"));
  const timeRef = Util.getReferenceFor(sheet.lastWrite.row, sheet.lastWrite.col);
  Util.appendDataToSheet(sheet, ["Total Delivery Time", "", "(in minutes)"]);
  sheet.lastWrite.col = 0;
  Util.appendFormulaToSheet(sheet, `${timeRef} / 60`);
  Util.appendDataToSheet(sheet, ["Total Delivery Time", "", "(in hours)"]);
  sheet.lastWrite.col = 0;
  Util.appendFormulaToSheet(sheet, `${timeRef} / 3600`);
  return sheet;
}
