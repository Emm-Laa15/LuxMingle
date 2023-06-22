require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log(err));

// Define message schema and model
const MessageSchema = new mongoose.Schema({
  content: String,
  timestamp: Date
});
const Message = mongoose.model('Message', MessageSchema);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));  // Serve your HTML, CSS, JS files

io.on('connection', async (socket) => {
  console.log('a user connected');

  // Send existing messages to the client
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50).exec();
    socket.emit('init', messages);
  } catch(err) {
    console.error(err);
  }

  // Handle message event
  socket.on('message', async (messageContent) => {
    console.log('message: ' + messageContent);

    // Save message to the database
    const message = new Message({ content: messageContent, timestamp: new Date() });
    try {
      await message.save();
      // Send the message to all connected clients
      io.emit('message', message);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => console.log('listening on *:3000'));
