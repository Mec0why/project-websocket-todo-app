// initialize server
const express = require('express'),
  app = express(),
  socket = require('socket.io'),
  db = require('./db'),
  path = require('path');

app.get('/tasks', (req, res) => {
  res.json(db.tasks);
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send('404 You shall not pass!');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('updateData', () => {
    socket.emit('updateData', db.tasks);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});
