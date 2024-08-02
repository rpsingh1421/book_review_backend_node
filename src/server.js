const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { connectDB } = require('./config/db');
const { reviewEventEmitter } = require('./events/eventEmitter');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
// ================================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// =====================================
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
    // globally accessed
app.use(cors({
    origin: '*',
    credentials: true
}));
// Connect to the database
connectDB();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to node js application." });
});
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Replace app.listen with server.listen
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// WebSocket connection
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Event Listeners
// reviewEventEmitter.on('reviewAdded', (review) => {
//   console.log('New review added:', review);
// });

// reviewEventEmitter.on('reviewEdited', (review) => {
//   console.log('Review edited:', review);
// });

// reviewEventEmitter.on('reviewDeleted', (reviewId) => {
//   console.log('Review deleted:', reviewId);
// });

// Modifed review event handlers to emit socket events
reviewEventEmitter.on('reviewAdded', (review) => {
  console.log('New review added:', review);
  io.emit('notification', { type: 'reviewAdded', data: review });
});

reviewEventEmitter.on('reviewEdited', (review) => {
  console.log('Review edited:', review);
  io.emit('notification', { type: 'reviewEdited', data: review });
});

reviewEventEmitter.on('reviewDeleted', (reviewId) => {
  console.log('Review deleted:', reviewId);
  io.emit('notification', { type: 'reviewDeleted', data: reviewId });
});
