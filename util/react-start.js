const Path = require('path');
const ChildProcess = require('child_process');

process.env.BROWSER = "none";
const path = Path.join("node_modules", "react-scripts", "bin", "react-scripts.js");
const command = `node ${path} start`

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

process.on(null, () => {
  console.log('Received Null. Press Control-D to exit.');
});

ChildProcess.exec(command).stdout.on('data', (data) => {
  console.log(data);
})
