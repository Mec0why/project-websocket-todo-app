// initialize server
const express = require('express'),
  app = express(),
  socket = require('socket.io'),
  db = require('./db'),
  path = require('path'),
  cors = require('cors');

app.get('/tasks', (req, res) => {
  res.json(db.tasks);
});

app.use(
  cors({
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    methods: '*',
  })
);

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

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: '*',
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.emit('updateData', db.tasks);

  socket.on('addTask', (task) => {
    db.tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const filteredDb = db.tasks.filter((task) =>
      task.id === taskId ? false : true
    );

    console.log(taskId);

    db.tasks = filteredDb;
    console.log(db.tasks);

    socket.broadcast.emit('removeTask', taskId);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});
