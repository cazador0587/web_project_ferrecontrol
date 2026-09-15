const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Obtener carrito del usuario autenticado
router.get("/", authMiddleware, getCart);

// Agregar producto al carrito
router.post("/items", authMiddleware, addToCart);

// Actualizar cantidad de producto
router.patch(
  "/items/:productId",
  authMiddleware,
  updateCartItem
);

// Eliminar producto del carrito
router.delete(
  "/items/:productId",
  authMiddleware,
  removeFromCart
);

module.exports = router;
