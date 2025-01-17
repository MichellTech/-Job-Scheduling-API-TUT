const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      required: true,
      default: 'not-treated',
      enum: ['treated', 'not-treated'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
