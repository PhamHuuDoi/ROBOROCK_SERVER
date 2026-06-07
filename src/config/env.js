require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_ACCESS_EXPIRES:
    process.env.JWT_ACCESS_EXPIRES || "15m",

  JWT_REFRESH_EXPIRES:
    process.env.JWT_REFRESH_EXPIRES || "7d",

  BCRYPT_SALT_ROUNDS:
    Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};