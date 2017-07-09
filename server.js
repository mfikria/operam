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

app.get('/operam.js', (req, res) => {
  res.sendFile('build/operam.js', path);
});

app.use(express.static('public'));

if (typeof (PhusionPassenger) !== 'undefined') {
  server = app.listen('/passenger');
} else {
  server = app.listen(port, () => {
    console.log('Connect your client to http://localhost:3000/');
  });
}

const io = socketio.listen(server);

const OTServer = new CentralServer(io);
