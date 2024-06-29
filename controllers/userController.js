const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Application = require('../models/application');
const User = require('../models/user');
const Task = require('../models/task');
const History = require('../models/history');
const user = require('../models/user');

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(StatusCodes.OK).json({ count: user.length, users });
};
const getSingleUserApplications = async (req, res) => {
  const { userId } = req.body;
  const applications = await Application.find({
    user: userId,
  }).populate({
    path: 'job',
    select: 'position client isOpen',
  });
  res.status(StatusCodes.OK).json({ count: applications.length, applications });
};
const getSingleUserJobHistory = async (req, res) => {
  const { userId } = req.body;
  const history = await History.find({
    user: userId,
  }).populate({
    path: 'job',
    select: 'position client isOpen',
  });
  res.status(StatusCodes.OK).json({ count: history.length, history });
};
const getSingleUserTask = async (req, res) => {
  const { userId } = req.body;
  const task = await Task.find({
    user: userId,
  }).populate({
    path: 'job',
    select: 'position client isOpen',
  });
  res.status(StatusCodes.OK).json({ count: task.length, task });
};

module.exports = {
  getAllUsers,
  getSingleUserApplications,
  getSingleUserJobHistory,
  getSingleUserTask,
};
