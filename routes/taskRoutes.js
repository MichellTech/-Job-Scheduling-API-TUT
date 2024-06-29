const express = require('express');
const router = express.Router();
const {
  finishedTask,
  closeOutTask,
  redoTask,
  getAllTasks,
  getUserTasks,
} = require('../controllers/taskController');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllTasks);
router.route('/user').get(authenticateUser, getUserTasks);
router.route('/submit').post(authenticateUser, finishedTask);
router
  .route('/approve')
  .post(authenticateUser, authorizePermissions('admin'), closeOutTask);
router
  .route('/reject')
  .post(authenticateUser, authorizePermissions('admin'), redoTask);

module.exports = router;
