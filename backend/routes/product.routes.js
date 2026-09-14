const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
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

// Actualizar producto — solo administradores
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

// Eliminar producto — solo administradores
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;
