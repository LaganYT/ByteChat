// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Add user to the list
  socket.on('addUser', (username) => {
    users[socket.id] = username;
    io.emit('userList', Object.values(users));
  });

  // Handle incoming chat messages
  socket.on('message', (message) => {
    io.emit('message', { user: users[socket.id], text: message });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userList', Object.values(users));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
