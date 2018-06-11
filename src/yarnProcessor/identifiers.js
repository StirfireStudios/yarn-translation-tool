const minWidth = 4;

let idNumber = 0;
let maxID = 0;
let used = [];

export function reset(offset) {
  if (offset == null) offset = 0;
  idNumber = offset;
  maxID = offset;
  used = [];
}

export function addExisting(existingIdentifier) {
  if (existingIdentifier == null) {
    return; 
  }

  const parsedId = parseInt(existingIdentifier, 16);
  used.push(parsedId);
  if (maxID < parsedId) maxID = parsedId;
}

export function addNew() {
  while(used.indexOf(idNumber) != -1) idNumber++;

  const thisId = idNumber;
  if (maxID < thisId) maxID = thisId;
  idNumber++;
  return thisId;
}

export function finalize(identifer) {
  let width = maxID.toString(16).length;
  if (width < minWidth) width = minWidth;
  return identifer.toString(16).padStart(width, "0");
}
