const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repo = require("../repository/auth.repository");
const jwtConfig = require("../../../config/jwt");
const env = require("../../../config/env");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../config/jwt");

async function register({ fullName, email, password }) {
  const existingUser = await repo.findUserByEmail(email);

  if (existingUser) {
    throw new Error(
      JSON.stringify({
        status: 409,
        message: "Email already registered",
      }),
    );
  }

  const customerRole = await repo.findRoleByName("CUSTOMER");

  if (!customerRole) {
    throw {
      status: 500,
      message: "Default role CUSTOMER not found",
    };
  }

  const hashed = await bcrypt.hash(password, Number(env.BCRYPT_SALT_ROUNDS));

  const user = await repo.createUser({
    fullName,
    email,
    password: hashed,
    roleId: customerRole.id,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: customerRole.name,
  };
}
function generateTokens(user) {
  const accessToken =
    generateAccessToken({
      sub: user.id,
      role: user.role.name,
    });

  const refreshToken =
    generateRefreshToken({
      sub: user.id,
    });

  return {
    accessToken,
    refreshToken,
  };
}

async function login({ email, password }) {

  const user =
    await repo.findUserByEmail(email);

  if (!user) {
    throw {
      status: 401,
      message: "Invalid credentials",
    };
  }

  const ok =
    await bcrypt.compare(
      password,
      user.password,
    );

  if (!ok) {
    throw {
      status: 401,
      message: "Invalid credentials",
    };
  }

  const {
    accessToken,
    refreshToken,
  } = generateTokens(user);

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    },
  };
}
module.exports = {
  register,
  login,
};
