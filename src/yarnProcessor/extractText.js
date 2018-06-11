import { Statement as YarnStatements } from 'jacquard-yarnparser'; 

import DialogueSegment from 'jacquard-yarnparser/dist/statements/dialogueSegment';

import * as Identifiers from './identifiers';

function processLineGroup(segment, group) {
  let foundText = false;
  let wordCount = 0;
  const textParts = [];
  for(let statement of group.statements) {
    if (statement instanceof YarnStatements.Text) {
      foundText = true;
      textParts.push(statement.text);
      wordCount += statement.text.split(/\s+/).length;
    } else if (statement instanceof YarnStatements.Command) {
      textParts.push(`<COMMAND: ${statement.arguments.join(" ")}>`);
    } else if (statement instanceof YarnStatements.Evaluate) {
      textParts.push(`<EVALUATE>`);
    }
  }

  if (foundText) { 
    segment.lines.push({
      wordCount: wordCount,
      text: textParts.join(" "),
    });
    segment.wordCount += wordCount;
  }
}

function processStatements(segment, statements) {
  for(let statement of statements) {
    switch(statement.constructor) {
      case YarnStatements.Text:
        const wordCount = statement.text.split(/\s+/).length;
        segment.lines.push({
          wordCount: wordCount,
          text: statement.text,
        });
        segment.wordCount += wordCount;
        break;
      case YarnStatements.LineGroup:
        processLineGroup(segment, statement);
        break;
    }
  }
}

export default function extractText(nodes) {
  const segments = [];
  for(let node of nodes) {
    for(let statement of node.dialogueStatements) {
      const segment = {
        nodeName: node.nodeName,
        tags: node.tags,
        identifier: statement.identifier,
        existingIdentifier: statement.identifier != null,
        startLine: statement.location.start.line,
        startColumn: statement.location.start.column,
        lines: [],
        wordCounts: [],
        wordCount: 0,
      }
      Identifiers.addExisting(segment.identifier);
      segments.push(segment);
      processStatements(segment, statement.statements);
    }
  }

  for(let segment of segments) {
    if (segment.existingIdentifier) continue;
    segment.identifier = Identifiers.addNew();
  }

  for(let segment of segments) segment.identifier = Identifiers.finalize(segment.identifier);
  return segments;
}
