function addPadding(string, padding) {
  let output = "";
  for(let index = 0; index < padding; index++) {
    output += " ";
  }
  output += string;
  return output;
}

export default function process(yarntxt, results) {
  const lines = yarntxt.split(/\r\n|\n/);
  let offset = 0;

  results.forEach(statement => {
    if (statement.existingIdentifier) return;
    const identifierTag = `#dialogRef:${statement.identifier}`;

    const segmentStartLineIndex = statement.startLine + offset - 1;
    if (statement.startColumn === 0) {
      lines.splice(segmentStartLineIndex, 0, identifierTag);  
    } else {
      const column = statement.startColumn - 2; // the -2 is to account for the start/stop chars we insert
      const startOfLine = lines[segmentStartLineIndex].substr(0, column);
      const endOfLine = lines[segmentStartLineIndex].substr(column);
      lines[segmentStartLineIndex] = `${startOfLine}${identifierTag}`;
      lines.splice(segmentStartLineIndex + 1, 0, addPadding(endOfLine, column));
    }

    offset++;
  });

  return lines.join("\n");
}
