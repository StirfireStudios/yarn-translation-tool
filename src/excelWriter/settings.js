import XLSX from 'xlsx';

import * as Util from './util'

const defaults = Object.freeze({
  "Words Per Second": 1.8,
});

export function generate() {
  let row = 0;
  const sheet = Util.setupSheet(["Name", "Value"]);
  row += 1;
  sheet.locations = {};
  Object.keys(defaults).forEach((setting) => {
    const value = defaults[setting];
    XLSX.utils.sheet_add_aoa(sheet, [[setting, value]], {origin: -1});
    row += 1;
    if (setting.length > sheet['!cols'][0].wch) {
      sheet['!cols'][0].wch = setting.length;
    }
    sheet.locations[setting] = Util.getReferenceFor(row - 1, 1);
  });

  sheet.lastWrite = {row: row - 1, col: 1};
  return sheet;
}
