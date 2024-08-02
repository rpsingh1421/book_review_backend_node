const mongoose = require('mongoose');
const Review = require('../models/review');
const { reviewEventEmitter } = require('../events/eventEmitter');
const User = require('../models/user');

exports.getReviews = async (req, res) => {
  console.log("user:",req.user);
    try {
      const reviews = await Review.find({ userId: req.user.userId });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.addReview = async (req, res) => {
  const { bookTitle, review, rating, author } = req.body;

    try {
      // // Validate if the provided userId is a valid MongoDB ObjectId
      // if (!mongoose.Types.ObjectId.isValid( req.user.id,)) {
      //   return res.status(400).json({ error: "Invalid user ID format" });
      // }

      // // Check if the user exists
      // const user = await User.findById( req.user.id,);
      // if (!user) {
      //   return res.status(404).json({ error: "User not found" });
      // }

      const newReview = new Review({
        userId: req.user.userId,
        bookTitle,
        review,
        rating,
        author,
      });

      const savedReview = await newReview.save();
      
      // Uncomment these lines if you want to use the event emitter
      reviewEventEmitter.emit('reviewAdded', savedReview);

      res.status(201).json({ 
        message: "Review added successfully",
        review: savedReview,
        // user: user
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.editReview = async (req, res) => {
    const { id } = req.params;
    const { bookTitle, review, rating,author } = req.body;

    try {
      let reviewToEdit = await Review.findById(id);

      if (!reviewToEdit) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      reviewToEdit.bookTitle = bookTitle;
      reviewToEdit.review = review;
      reviewToEdit.rating = rating;
      reviewToEdit.author = author;

      const updatedReview = await reviewToEdit.save();
      reviewEventEmitter.emit('reviewEdited', updatedReview);

      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    console.log("reviewid:",id);
    try {
      const reviewToDelete = await Review.findById(id);
      console.log("review:",reviewToDelete);
      if (!reviewToDelete) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      await reviewToDelete.deleteOne();
      reviewEventEmitter.emit('reviewDeleted', id);

      res.json({ msg: 'Review deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
