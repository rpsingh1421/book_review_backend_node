const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { connectDB } = require('./config/db');
const { reviewEventEmitter } = require('./events/eventEmitter');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Event Listeners
reviewEventEmitter.on('reviewAdded', (review) => {
  console.log('New review added:', review);
});

reviewEventEmitter.on('reviewEdited', (review) => {
  console.log('Review edited:', review);
});

reviewEventEmitter.on('reviewDeleted', (reviewId) => {
  console.log('Review deleted:', reviewId);
});
