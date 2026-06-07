const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repo = require("../repository/auth.repository");
const jwtConfig = require("../../../config/jwt");
const env = require("../../../config/env");

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
async function login({ email, password }) {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role?.name },
    jwtConfig.SECRET,
    { expiresIn: jwtConfig.ACCESS_EXPIRES },
  );
  const refreshToken = jwt.sign({ sub: user.id }, jwtConfig.SECRET, {
    expiresIn: jwtConfig.REFRESH_EXPIRES,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role?.name,
    },
  };
}
module.exports = {
  register,
  login,
};
