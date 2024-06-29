const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Job = require('../models/job');
const createJob = async (req, res) => {
  const { position, client, pay, location, description } = req.body;
  if (!position || !client || !pay || !location || !description) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  req.body.user = req.user.id;
  const job = await Job.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ job, msg: 'Job created successfully' });
};

const getAllJobs = async (req, res) => {
  const job = await Job.find({ isOpen: true });
  res.status(StatusCodes.OK).json({ count: job.length, job });
};
const getSingleJob = async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new CustomError.BadRequestError('job with id doesnt exist');
  }

  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) {
    throw new CustomError.BadRequestError('job with id doesnt exist');
  }

  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new CustomError.NotFoundError('No product with id exists');
  }
  await Job.deleteOne({ _id: jobId });
  res.status(StatusCodes.OK).json({ msg: 'Job deleted successfully' });
};

module.exports = { createJob, getAllJobs, getSingleJob, updateJob, deleteJob };
