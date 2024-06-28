const User = require('../models/user');
const Token = require('../models/token');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse } = require('../utils/jwt');
const crypto = require('crypto');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomError.BadRequestError(
      'email already exists , please login instead'
    );
  }
  const user = await User.create(req.body);
  const userDetails = {
    name: user.name,
    id: user._id,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
  };
  let refreshToken = '';
  //   check for existing
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: userDetails, refreshToken });

    res.status(StatusCodes.OK).json({ user: userDetails });
    return;
  }
  // create a new token
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: userDetails, refreshToken });
  res.status(StatusCodes.CREATED).json({ user: userDetails });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('invalid Credentials');
  }
  const userDetails = {
    name: user.name,
    id: user._id,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
  };
  let refreshToken = '';
  //   check for existing
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: userDetails, refreshToken });

    res.status(StatusCodes.OK).json({ user: userDetails });
    return;
  }

  // create a new token
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: userDetails, refreshToken });
  res.status(StatusCodes.CREATED).json({ user: userDetails });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.id });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const approveUser = async (req, res) => {
  const userToApproveId = req.params.id;
  const user = await User.findOneAndUpdate(
    { _id: userToApproveId },
    { isApproved: true },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new CustomError.BadRequestError('user with id does not exist');
  }

  res.status(StatusCodes.OK).json({ user, msg: 'user is approved' });
};

const deleteUser = async (req, res) => {
  const userToDeleteId = req.params.id;

  const user = await User.findByIdAndDelete(userToDeleteId);

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  await Token.deleteMany({ user: userToDeleteId });

  res
    .status(StatusCodes.OK)
    .send({ msg: 'User and associated data deleted successfully' });
};

module.exports = { register, login, logout, approveUser, deleteUser };
