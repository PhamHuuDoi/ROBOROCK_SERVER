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
async function login(
  req,
  res,
  next,
) {
  try {

    const result =
      await service.login(
        req.body,
      );

    return res.json(result);

  } catch (err) {
    next(err);
  }
}
module.exports = { register, login };