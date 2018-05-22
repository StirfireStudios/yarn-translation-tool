import getDialogueSegments from './getDialogueSegments';
import extractText from './extractText';
import * as Identifiers from './identifiers';

let wordsPerSecond = 1.8;

function formatOutput(segments) {
  const output = {recording: [], translation: [], processing: []}
  output.processing.push([
    "Text", "Node Name", "SegmentID", "Line number"
  ]);
  output.recording.push([
    "Text", "Node Name", "SegmentID", "Word Count", "Est. Length"
  ]);
  output.translation.push([
    "Text", "Node Name", "SegmentID", "Path", "Notes", "Word Count"
  ]);
  segments.forEach((segment) => {
    const nodeName = segment.nodeName;
    const segmentID = segment.identifier;
    let lineNo = 1;
    const allText = [];
    segment.lines.forEach((line) => {
      output.processing.push([
        line.text,
        nodeName,
        segmentID,
        lineNo,
      ]);
      lineNo++;
      allText.push(line.text);
    });

    output.recording.push([
      allText.join("\n"),
      nodeName,
      segmentID,
      segment.wordCount,
      Math.ceil(segment.wordCount / wordsPerSecond)
    ]);

    output.translation.push([
      allText.join("\n"),
      nodeName,
      segmentID,
      `Dialog.${segmentID}`,
      "n/a",
      segment.wordCount,
    ]);

  });

  return output;
}

export default function process(parser) {
  Identifiers.reset();
  const nodes = getDialogueSegments(parser);
  return formatOutput(extractText(nodes));;
}
