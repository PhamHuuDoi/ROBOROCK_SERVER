function success(res, statusCode, message, data = null) {
  const body = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(body);
}

module.exports = success;
