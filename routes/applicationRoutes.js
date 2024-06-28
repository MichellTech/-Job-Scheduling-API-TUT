const express = require('express');
const router = express.Router();
const {
  applyForJob,
  withdrawApplication,
  approveApplication,
  denyApplication,
  getAllApplications,
  getSingleApplication,
  getUserApplications,
} = require('../controllers/applicationController');

const {
  authenticateUser,
  authorizePermissions,
  applicationPermissions,
} = require('../middleware/authentication');

router
  .route('/apply')
  .post(authenticateUser, applicationPermissions(), applyForJob);
router.route('/withdraw').post(authenticateUser, withdrawApplication);
router
  .route('/approve')
  .post(authenticateUser, authorizePermissions('admin'), approveApplication);
router
  .route('/deny')
  .post(authenticateUser, authorizePermissions('admin'), denyApplication);
router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllApplications);
router.route('/user').get(authenticateUser, getUserApplications);
router
  .route('/:id')
  .get(authenticateUser, authorizePermissions('admin'), getSingleApplication);

module.exports = router;
