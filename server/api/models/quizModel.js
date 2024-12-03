const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    images: {
      type: [String],
      default: [] // Array of image URLs
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Quiz };