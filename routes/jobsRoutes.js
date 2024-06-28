const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobsController');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'), createJob)
  .get(authenticateUser, getAllJobs);
router
  .route('/:id')
  .patch(authenticateUser, authorizePermissions('admin'), updateJob)
  .delete(authenticateUser, authorizePermissions('admin'), deleteJob)
  .get(authenticateUser, getSingleJob);

module.exports = router;
