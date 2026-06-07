const {
  verifyToken,
} = require("../config/jwt");

function authMiddleware(
  req,
  res,
  next,
) {

  const auth =
    req.headers.authorization;

  if (
    !auth ||
    !auth.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {

    const token =
      auth.split(" ")[1];

    const payload =
      verifyToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();

  } catch {

    return res.status(401).json({
      error: "Invalid token",
    });

  }
}

module.exports = {
  authMiddleware,
};