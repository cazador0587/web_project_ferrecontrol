const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  getUserCount,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/admin/user-count", authMiddleware, adminMiddleware, getUserCount);

router.get("/admin-test", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    message: "Acceso de administrador autorizado",
    user: req.user,
  });
});

module.exports = router;