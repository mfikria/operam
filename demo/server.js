const port = 7000;

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const CentralServer = require('../src/core/central-server');

const path = { root: __dirname };

// Demo tanks game
app.get('/tanks-game', (req, res) => {
  res.sendFile('tanks-game/index.html', path);
});

// Demo text editor
app.get('/text-editor', (req, res) => {
  res.sendFile('text-editor/index.html', path);
});
app.get('/operam.js', (req, res) => {
  res.sendFile('operam.js', path);
});

app.get('*', (req, res) => {
  res.sendFile(req.path, path);
});

// Demo flowchart diagram
app.get('/flowchart-diagram', (req, res) => {
  res.sendFile('flowchart-diagram/index.html', path);
});

http.listen(port, () => {
  console.log('Connect your client to http://localhost:7000/');
});

const server = new CentralServer(io);
