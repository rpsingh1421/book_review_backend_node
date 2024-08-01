const express = require('express');
const {
  getReviews,
  addReview,
  editReview,
  deleteReview,
} = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getReviews);
router.post('/', addReview);
router.put('/:id', editReview);
router.delete('/:id', deleteReview);

module.exports = router;
