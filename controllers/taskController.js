const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Application = require('../models/application');
const Job = require('../models/job');
const Task = require('../models/task');
const History = require('../models/history');

const finishedTask = async (req, res) => {
  const { taskId } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: req.user.id,
      status: { $in: ['ongoing', 'rejected'] },
    },
    {
      status: 'completed',
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new CustomError.BadRequestError('Task does not exist ');
  }

  res
    .status(StatusCodes.OK)
    .json({ task, msg: 'task completed awaiting admin approval' });
};
const closeOutTask = async (req, res) => {
  const { taskId } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      status: { $in: ['completed'] },
    },
    {
      status: 'closed',
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new CustomError.BadRequestError('Task does not exist ');
  }

  res
    .status(StatusCodes.OK)
    .json({ task, msg: 'you have closed out this task' });
};

const redoTask = async (req, res) => {
  const { taskId } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      status: { $in: ['completed'] },
    },
    {
      status: 'rejected',
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new CustomError.BadRequestError('Task does not exist ');
  }

  res
    .status(StatusCodes.OK)
    .json({ task, msg: 'you have asked the user to redo this task' });
};
const getAllTasks = async (req, res) => {
  const task = await Task.find({})
    .populate({
      path: 'job',
      select: 'position client isOpen',
    })
    .populate({
      path: 'user',
      select: 'name email',
    });
  res.status(StatusCodes.OK).json({ count: task.length, task });
};
const getUserTasks = async (req, res) => {
  const task = await Task.find({ user: req.user.id }).populate({
    path: 'job',
    select: 'position client isOpen',
  });
  res.status(StatusCodes.OK).json({ count: task.length, task });
};

module.exports = {
  finishedTask,
  closeOutTask,
  redoTask,
  getAllTasks,
  getUserTasks,
};
