const express = require("express");

const {
  createProduct,
  getProducts,
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Consultar productos — público
router.get("/", getProducts);

// Crear producto — solo administradores
router.post("/", authMiddleware, adminMiddleware, createProduct);

module.exports = router;
