const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "No autenticado",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "No tienes permisos para realizar esta acción",
    });
  }

  next();
};

module.exports = adminMiddleware;
