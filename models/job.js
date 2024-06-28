const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'please provide a job position'],
      trim: true,
    },
    client: {
      type: String,
      required: [true, 'please provide a client name'],
      trim: true,
    },
    pay: {
      type: Number,
      required: [true, 'please provide a payment amount'],
    },
    location: {
      type: String,
      required: [true, 'please provide a client location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'please provide a job description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedUser: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: null, // Ensure the assignedUser is initially null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
