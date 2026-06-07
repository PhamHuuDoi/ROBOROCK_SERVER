const jwt = require("jsonwebtoken");
const env = require("./env");

const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES,
    },
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES,
    },
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    env.JWT_SECRET,
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};