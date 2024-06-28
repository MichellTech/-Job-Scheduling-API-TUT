const jwt = require('jsonwebtoken');

const createJWT = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user }, expiresIn: '1d' });
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
    expiresIn: '7d',
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneWeek),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
