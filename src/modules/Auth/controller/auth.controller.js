const service = require("../service/auth.service");
async function register(req, res, next) {
  try {
    const payload = req.validated;
    const user = await service.register(payload);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
module.exports = { register };