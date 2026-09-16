const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Obtener pedidos del usuario autenticado
router.get(
  "/",
  authMiddleware,
  getMyOrders,
);

// Obtener todos los pedidos (solo para administradores)
router.get("/admin/all", adminMiddleware, adminMiddleware, getAllOrders);

// Actualizar estado de un pedido — solo administradores
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// Obtener detalle de un pedido
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

// Crear pedido a partir del carrito
router.post("/", authMiddleware, createOrder);

module.exports = router;
