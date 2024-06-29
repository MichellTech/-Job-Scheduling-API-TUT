const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['assigned', 'rejected', 'pending', 'withdrawn'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', HistorySchema);
