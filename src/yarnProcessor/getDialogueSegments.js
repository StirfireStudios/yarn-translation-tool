import { Statement as YarnStatements } from 'jacquard-yarnparser'; 

import DialogueSegment from 'jacquard-yarnparser/dist/statements/dialogueSegment';

function processStatements(array, statements, response) {
  if (response == null) response = false;
  for(let statement of statements) {
    if (statement instanceof DialogueSegment) {
      array.push({response: response, statement: statement});
      continue;
    }
    
    if (statement instanceof YarnStatements.OptionGroup) {
      processStatements(array, statement.statements, true);
      continue;
    }

    if (statement instanceof YarnStatements.ShortcutGroup) {
      processStatements(array, statement.statements, true);
      continue;
    }

    if (statement.statements != null) {
      processStatements(array, statement.statements, response);
    } 
    if (statement.clauses != null) {
      for(let clause of statement.clauses) {
        processStatements(array, clause.statements, response);
      }
    }
  }
}

export default function getDialogueSegments(parser) {
  const nodes = [];
  for(let nodeName of parser.nodeNames) {
    const node = parser.nodeNamed(nodeName);
    const nodeSegment = {
      nodeName: nodeName,
      tags: node.tags,
      dialogueSegments: [],
    }
    processStatements(nodeSegment.dialogueSegments, node.statements);
    nodes.push(nodeSegment);
  }
  return nodes;
}
