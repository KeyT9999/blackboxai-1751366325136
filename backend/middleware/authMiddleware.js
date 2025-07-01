function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

function isAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' });
  }
}

module.exports = {
  isAuthenticated,
  isAdmin
};
