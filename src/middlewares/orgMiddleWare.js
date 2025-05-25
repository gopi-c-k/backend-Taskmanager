// middleware/orgMiddleware.js
module.exports = function (model) {
  return async (req, res, next) => {
    const resource = await model.findById(req.params.id || req.body.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });

    if (resource.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Access denied: wrong organization' });
    }

    next();
  };
};
