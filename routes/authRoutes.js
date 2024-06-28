const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  approveUser,
  deleteUser,
} = require('../controllers/authController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').delete(authenticateUser, logout);
router
  .route('/approveuser/:id')
  .post(authenticateUser, authorizePermissions('admin'), approveUser);
router
  .route('/deleteuser/:id')
  .delete(authenticateUser, authorizePermissions('admin'), deleteUser);
module.exports = router;
