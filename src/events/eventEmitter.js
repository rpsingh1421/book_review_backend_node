const EventEmitter = require('events');
class ReviewEventEmitter extends EventEmitter {}

const reviewEventEmitter = new ReviewEventEmitter();

module.exports = { reviewEventEmitter };
