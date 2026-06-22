const service = require("../service/auth.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");


async function register(req, res, next) {
  try {
    const user = await service.register(req.validated);
    return success(res, 201, MESSAGES.AUTH.REGISTER_SUCCESS, user);
  } catch (err) {
    next(err);
  }
}

// ── 3 endpoint login ──────────────────────────────────
async function loginCustomer(req, res, next) {
  try {
    const result = await service.loginAs("customer", req.validated);
    return success(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function loginStaff(req, res, next) {
  try {
    const result = await service.loginAs("staff", req.validated);
    return success(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function loginAdmin(req, res, next) {
  try {
    const result = await service.loginAs("admin", req.validated);
    return success(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// ── refresh + logout ──────────────────────────────────
async function refresh(req, res, next) {
  try {
    const result = await service.refreshAccessToken(req.validated.refreshToken);
    return success(res, 200, MESSAGES.AUTH.REFRESH_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await service.logout(req.validated.refreshToken);
    return success(res, 200, MESSAGES.AUTH.LOGOUT_SUCCESS);
  } catch (err) {
    next(err);
  }
}

async function logoutAll(req, res, next) {
  try {
    // req.user.id được set bởi authMiddleware
    await service.logoutAll(req.user.id);
    return success(res, 200, MESSAGES.AUTH.LOGOUT_ALL_SUCCESS);
  } catch (err) {
    next(err);
  }
}
module.exports = { register, loginCustomer, loginStaff, loginAdmin, refresh, logout, logoutAll };
