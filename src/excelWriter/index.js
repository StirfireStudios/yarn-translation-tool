import XLSX from 'xlsx';

import * as Util from './util'
import * as Settings from './settings';
import * as Summary from './summary';
 
let wordsPerSecond = 1.8;

export default function excelWriter(results) {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Dialog information",
    Author: "Translation tool",
    CreatedDate: new Date()
  };

  const recording = Util.setupSheet([
    "Text", "SegmentID", "Node Name", "Node Tags", "Lines", "Word Count", "Est. Length", 
  ]);
  const translation = Util.setupSheet([
    "Text", "Response", "SegmentID", "Node Name", "Path", "Notes", "Word Count",
  ]);
  const processing = Util.setupSheet([
    "Text", "SegmentID", "Line number", "Node Name", "File Directory",
  ]);

  const settings = Settings.generate();

  const wordCountRef = {col: 5, firstRow: 1, finalRow: 1, sheetName: "Recording Info"};
  const lineRef = {col: 4, firstRow: 1, finalRow: 1, sheetName: "Recording Info"};
  const lineTextRef = {col: 0, firstRow: 1, finalRow: 1, sheetName: "Processing Info"};
  const lengthRef = {col: 6, firstRow: 1, finalRow: 1, sheetName: "Recording Info"};

  results.forEach((segment) => {
    const nodeName = segment.nodeName;
    const segmentID = segment.identifier;
    let lineNo = 1;
    const allText = [];
    segment.lines.forEach((line) => {
      allText.push(line.text);
      if (segment.response) return;
      Util.appendDataToSheet(processing, [
        line.text,
        segmentID,
        lineNo,
        nodeName,
        `\\Face\\${segmentID}\\`,
      ]);
      lineTextRef.finalRow++;
      lineNo++;
    }); 

    if (!segment.response) {
      let tagString = "n/a";
      if (Array.isArray(segment.tags)) tagString = segment.tags.join(",");
  
      Util.appendDataToSheet(recording, [
        allText.join("\n"),
        segment.response ? "Yes" : "No",
        segmentID,
        nodeName,
        tagString,
        lineNo - 1,
        segment.wordCount,
      ]);
  
      wordCountRef.finalRow++;
      lineRef.finalRow++;
      lengthRef.finalRow++;

      const wordCountCellRef = Util.getReferenceFor(recording.lastWrite.row, recording.lastWrite.col);
      Util.appendFormulaToSheet(recording, `${wordCountCellRef}/Settings!${settings.locations["Words Per Second"]}`)  
    }

    Util.appendDataToSheet(translation, [
      allText.join("\n"),
      segment.response ? "Yes" : "No",
      segmentID,
      nodeName,
      `Dialog.${segmentID}`,
      segment.translationNotes.join(" \r\n"),
      segment.wordCount,
    ]);
  });

  wb.SheetNames.push("Summary");
  wb.SheetNames.push("Recording Info");
  wb.SheetNames.push("Translation Info");
  wb.SheetNames.push("Processing Info");
  wb.SheetNames.push("Settings");
  wb.Sheets["Summary"] = Summary.generate(wordCountRef, lineRef, lineTextRef, lengthRef);
  wb.Sheets["Recording Info"] = recording;
  wb.Sheets["Translation Info"] = translation;
  wb.Sheets["Processing Info"] = processing;
  wb.Sheets["Settings"] = settings;
  
  return Util.data(wb);
}
