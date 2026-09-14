const express = require("express");

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", authMiddleware, getCurrentUser);

module.exports = router;