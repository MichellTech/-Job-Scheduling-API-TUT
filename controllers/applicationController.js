const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Application = require('../models/application');
const Job = require('../models/job');
const Task = require('../models/task');

const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    throw new CustomError.BadRequestError('please provide job id');
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new CustomError.NotFoundError('Job with id does not exist');
  }
  if (!job.isOpen) {
    throw new CustomError.BadRequestError('Job is closed');
  }
  req.body.user = req.user.id;
  req.body.job = jobId;
  if (req.user.role === 'admin') {
    throw new CustomError.BadRequestError('Admins arent allowed to apply');
  }
  const hasUserApplied = await Application.findOne({
    user: req.user.id,
    job: jobId,
  });
  if (hasUserApplied) {
    throw new CustomError.BadRequestError(
      'you can not apply for this job twice'
    );
  }
  const apply = await Application.create(req.body);

  res.status(StatusCodes.CREATED).json({ apply, msg: 'Application sent' });
};

const withdrawApplication = async (req, res) => {
  const { applicationId } = req.body;

  if (req.user.role === 'admin') {
    throw new CustomError.BadRequestError(
      'Admins arent allowed withdraw applications'
    );
  }
  const application = await Application.findOne({
    _id: applicationId,
  }).populate({
    path: 'job',
    select: 'position client isOpen',
  });

  if (!application || !application.job.isOpen) {
    throw new CustomError.NotFoundError('Application not found');
  }

  if (application.user.toString() !== req.user.id) {
    throw new CustomError.BadRequestError(
      'You are not allowed to alter another persons application'
    );
  }

  await Application.deleteOne({ _id: applicationId });

  res
    .status(StatusCodes.OK)
    .json({ msg: 'your application hass been withdrawn' });
};
const approveApplication = async (req, res) => {
  const { applicationId } = req.body;
  console.log(applicationId);

  const application = await Application.findOne({ _id: applicationId })
    .populate({
      path: 'job',
      select: 'position client isOpen',
    })
    .populate({
      path: 'user',
      select: 'name email',
    });

  if (!application) {
    throw new CustomError.NotFoundError('Application not found ');
  }
  if (!application.job.isOpen) {
    throw new CustomError.NotFoundError('Job is closed');
  }

  const job = await Job.findByIdAndUpdate(
    application.job._id,
    {
      isOpen: false,
      assignedUser: application.user._id,
    },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new CustomError.NotFoundError('Job not found');
  }

  const task = await Task.create({
    job: application.job._id,
    user: application.user._id,
  });

  res
    .status(StatusCodes.OK)
    .json({ task, msg: 'Application approved and task created' });
};

const denyApplication = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'Application denied' });
};
const getAllApplications = async (req, res) => {
  const application = await Application.find({})
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate({
      path: 'job',
      select: 'position client',
    });
  res.status(StatusCodes.OK).json({ count: application.length, application });
};
const getSingleApplication = async (req, res) => {
  const applicationId = req.params.id;
  const application = await Application.findOne({ _id: applicationId })
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate({
      path: 'job',
      select: 'position client',
    });
  if (!application) {
    throw new CustomError.NotFoundError('application with id not found');
  }

  res.status(StatusCodes.OK).json({ application });
};
const getUserApplications = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'all user applications' });
};

module.exports = {
  applyForJob,
  withdrawApplication,
  approveApplication,
  denyApplication,
  getAllApplications,
  getSingleApplication,
  getUserApplications,
};
