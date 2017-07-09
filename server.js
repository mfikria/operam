if (typeof (PhusionPassenger) !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

const port = 3000;

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.set('transports', ['polling']);

const CentralServer = require('./src/core/central-server');

const path = { root: __dirname };

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
  http.listen('passenger');
} else {
  http.listen(port, () => {
    console.log('Connect your client to http://localhost:7000/');
  });
}

const server = new CentralServer(io);
