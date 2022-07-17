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

app.use((req, res) => {
  res.status(404).send('404 You shall not pass!');
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
