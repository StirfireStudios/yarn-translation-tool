const OS = require('os');
const Path = require('path');
const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}/index.html`;
console.log(`Port is ${port}`);

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const exec = require('child_process').exec;
            const electronBasePath = Path.join("node_modules", "electron", "dist");
            let electronPath = null;
            if (OS.type() == 'Darwin') {
                electronPath = Path.join(electronBasePath, "Electron.app", "Contents", "MacOS", "Electron");
            } else {
                electronPath = Path.join(electronBasePath, "electron");
            }
            exec(`${electronPath} .`);
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});
