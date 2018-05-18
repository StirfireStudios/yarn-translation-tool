import { Statement as YarnStatements} from 'jacquard-yarnparser'; 

import DialogueSegment from 'jacquard-yarnparser/dist/statements/dialogueSegment';

function processStatements(array, statements) {
  for(let statement of statements) {
    if (statement instanceof DialogueSegment) {
      array.push(statement);
      return;
    }

    if (statement.statements != null) {
      processStatements(array, statement.statements);
    } 
  }
}


export default function getDialogueSegments(parser) {
  const dialogueSegments = [];
  for(let nodeName of parser.nodeNames) {
    const node = parser.nodeNamed(nodeName);
    processStatements(dialogueSegments, node.statements);
  }
  console.log("Found:");
  console.log(dialogueSegments);
}