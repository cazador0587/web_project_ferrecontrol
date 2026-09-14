const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Consultar productos — público
router.get("/", getProducts);
// Consultar producto por ID — público
router.get("/:id", getProductById);

// Crear producto — solo administradores
router.post("/", authMiddleware, adminMiddleware, createProduct);

module.exports = router;
