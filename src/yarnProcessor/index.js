import XLSX from 'xlsx';

import getDialogueSegments from './getDialogueSegments';
import extractText from './extractText';
import * as Identifiers from './identifiers';

export default function process(parser, offset) {
  Identifiers.reset(offset);
  const nodes = getDialogueSegments(parser);
  return extractText(nodes);
}

