const minWidth = 4;

let idNumber = 0;
let maxID = 0;

export function reset() {
  idNumber = 0;
  maxID = 0;
}

export function check(existingIdentifier) {
  if (existingIdentifier == null) {
    existingIdentifier = idNumber;
    idNumber++;
  }

  if (maxID < existingIdentifier) maxID = existingIdentifier;

  return existingIdentifier;
}

export function finalize(identifer) {
  let width = maxID.toString(16).length;
  if (width < minWidth) width = minWidth;
  return identifer.toString(16).padStart(width, "0");
}
