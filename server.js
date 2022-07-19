// initialize server
const express = require('express'),
  app = express(),
  io = require('socket.io'),
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

const socket = io(server);

socket.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.emit('updateData', db.tasks);

  socket.on('addTask', (task) => {
    db.tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (task) => {
    const filteredDb = db.tasks.filter((task) =>
      task.id === socket.id ? false : true
    );

    db.tasks = filteredDb;
    console.log(db.tasks);

    socket.broadcast.emit('removeTask', task);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});
