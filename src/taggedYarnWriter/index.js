export default function process(yarntxt, results) {
  const lines = yarntxt.split(/\r\n|\n/);
  let offset = 0;

  results.forEach(statement => {
    if (statement.existingIdentifier) return;
    const identifierTag = `#dialogRef:${statement.identifier}`;
    const myLine = statement.startLine + offset - 1;
    lines.splice(myLine, 0, identifierTag);
    offset++;
  });

  return lines.join("\n");
}
