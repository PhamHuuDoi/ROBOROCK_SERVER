const service = require("../service/auth.service");


async function register(req, res, next) {
  try {
    const user = await service.register(req.validated);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// ── 3 endpoint login ──────────────────────────────────
async function loginCustomer(req, res, next) {
  try {
    const result = await service.loginAs("customer", req.validated);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function loginStaff(req, res, next) {
  try {
    const result = await service.loginAs("staff", req.validated);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function loginAdmin(req, res, next) {
  try {
    const result = await service.loginAs("admin", req.validated);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

// ── refresh + logout ──────────────────────────────────
async function refresh(req, res, next) {
  try {
    const result = await service.refreshAccessToken(req.validated.refreshToken);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await service.logout(req.validated.refreshToken);
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

async function logoutAll(req, res, next) {
  try {
    // req.user.id được set bởi authMiddleware
    await service.logoutAll(req.user.id);
    return res.json({ message: "All sessions logged out" });
  } catch (err) {
    next(err);
  }
}
module.exports = { register, loginCustomer, loginStaff, loginAdmin, refresh, logout, logoutAll };