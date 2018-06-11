import { Statement as YarnStatements } from 'jacquard-yarnparser'; 

import DialogueSegment from 'jacquard-yarnparser/dist/statements/dialogueSegment';

function processStatements(array, statements) {
  for(let statement of statements) {
    if (statement instanceof DialogueSegment) {
      array.push(statement);
      continue;
    }
    
    if (statement instanceof YarnStatements.OptionGroup) continue;
    if (statement instanceof YarnStatements.ShortcutGroup) continue;

    if (statement.statements != null) {
      processStatements(array, statement.statements);
    } 
    if (statement.clauses != null) {
      for(let clause of statement.clauses) {
        processStatements(array, clause.statements);
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
      dialogueStatements: [],
    }
    processStatements(nodeSegment.dialogueStatements, node.statements);
    nodes.push(nodeSegment);
  }
  return nodes;
}
