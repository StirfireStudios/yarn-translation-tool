import getDialogueSegments from './getDialogueSegments';
import extractText from './extractText';
import * as Identifiers from './identifiers';

function formatOutput(segments) {
  const output = [];
  output.headers = [
    "Text", "Node Name", "SegmentID", "Line number", "Word Count", "Est. Length"
  ];
  segments.forEach((segment) => {
    const nodeName = segment.nodeName;
    const segmentID = segment.identifier;
    let lineNo = 1;
    const allText = [];
    segment.lines.forEach((line) => {
      output.push([
        line.text,
        nodeName,
        segmentID,
        lineNo,
        line.wordCount
      ]);
      lineNo++;
      allText.push(line.text);
    });

    output.push([
      allText.join("\n"),
      nodeName,
      segmentID,
      "n/a",
      segment.wordCount
    ]);

  });

  return output;
}

export default function process(parser) {
  Identifiers.reset();
  const nodes = getDialogueSegments(parser);
  return formatOutput(extractText(nodes));;
}
