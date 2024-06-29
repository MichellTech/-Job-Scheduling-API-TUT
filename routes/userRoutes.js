const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUserApplications,
  getSingleUserJobHistory,
  getSingleUserTask,
} = require('../controllers/userController');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const { getSingleJob } = require('../controllers/jobsController');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router
  .route('/applications')
  .get(
    authenticateUser,
    authorizePermissions('admin'),
    getSingleUserApplications
  );
router
  .route('/job-history')
  .get(
    authenticateUser,
    authorizePermissions('admin'),
    getSingleUserJobHistory
  );
router
  .route('/tasks')
  .get(authenticateUser, authorizePermissions('admin'), getSingleUserTask);

module.exports = router;
