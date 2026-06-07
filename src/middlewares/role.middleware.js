function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(userRole)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { requireRole };
