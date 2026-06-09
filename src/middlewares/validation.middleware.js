const { ZodError } = require('zod');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req[source]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  };
}

module.exports = { validate };