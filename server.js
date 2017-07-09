if (typeof (PhusionPassenger) !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

const port = 3000;
const express = require('express');
const socketio = require('socket.io');

const app = express();
const CentralServer = require('./src/core/central-server');

const path = { root: __dirname };
let server;

// Demo text editor
app.get('/text-editor', (req, res) => {
  res.sendFile('public/text-editor/index.html', path);
});
app.get('/operam.js', (req, res) => {
  res.sendFile('build/operam.js', path);
});

app.get('*', (req, res) => {
  res.sendFile(`public/${req.path}`, path);
});

// Demo flowchart diagram
app.get('/flowchart-diagram', (req, res) => {
  res.sendFile('public/flowchart-diagram/index.html', path);
});

if (typeof (PhusionPassenger) !== 'undefined') {
  server = app.listen('passenger');
} else {
  server = app.listen(port, () => {
    console.log('Connect your client to http://localhost:3000/');
  });
}

const io = socketio.listen(server);

const OTServer = new CentralServer(io);
