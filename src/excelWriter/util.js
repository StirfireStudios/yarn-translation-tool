import XLSX from 'xlsx';

const wbOpts = {
  bookType:'xlsx', 
  bookSST:true, 
  compression: true, 
  type:'binary',
};

export function setupSheet(titles) {
  const sheet = XLSX.utils.aoa_to_sheet([titles]);
  sheet['!cols'] = titles.map((title) => {
    if (typeof(title) !== 'string') return {wch: title.length};
    return {wch: title.toString().length};
  });
  sheet.lastWrite = {row: 0, col: titles.length - 1};
  return sheet;
}

export function appendDataToSheet(sheet, newData) {
  XLSX.utils.sheet_add_aoa(sheet, [newData], {origin: -1});
  for(let index = 0; index < newData.length; index++) {
    let field = newData[index];
    const col = sheet['!cols'][index];
    if (typeof(field) !== 'string') {
      const length = field.toString().length;
      if (col.wch < length) col.wch = length;
      continue;
    } 
    field.split('\n').forEach((line) => {
      if (col.wch < line.length) col.wch = line.length;
    });
  }
  sheet.lastWrite = {row: sheet.lastWrite.row + 1, col: newData.length - 1};
}

export function appendFormulaToSheet(sheet, formula) {
  sheet.lastWrite.col++;
  const formulaCellRef = getReferenceFor(sheet.lastWrite.row, sheet.lastWrite.col);
  sheet[formulaCellRef] = {
    t: 'n',
    f: formula,
  }
}

export function data(workbook) {
  workbook.SheetNames.forEach((sheetName) => {
    delete(workbook.Sheets[sheetName].lastWrite);
  });
  delete(workbook.Sheets["Settings"].locations);
  return XLSX.write(workbook, wbOpts);
}

export function getReferenceFor(row, column) {
  const alpha = String.fromCharCode(65 + column);
  return `${alpha}${row + 1}`;
}
