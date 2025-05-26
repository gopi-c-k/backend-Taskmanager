// middleware/roleMiddleware.js
module.exports = function (allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.backUser.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
