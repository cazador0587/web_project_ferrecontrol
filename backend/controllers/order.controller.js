const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Crear pedido a partir del carrito
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cart = await Cart.findOne({
      user: req.user.id,
    })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "El carrito está vacío",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        await session.abortTransaction();

        return res.status(404).json({
          message: "Uno de los productos del carrito ya no existe",
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Stock insuficiente para el producto: ${product.name}`,
        });
      }

      const itemSubtotal = product.price * item.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const shipping = 0;
    const total = subtotal + shipping;

    const [order] = await Order.create(
      [
        {
          user: req.user.id,
          items: orderItems,
          subtotal,
          shipping,
          total,
          status: "pending",
        },
      ],
      { session },
    );

    for (const item of cart.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedProduct) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `No hay stock suficiente para el producto: ${item.product.name}`,
        });
      }
    }

    cart.items = [];

    await cart.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Pedido creado correctamente",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Error al crear pedido:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  } finally {
    session.endSession();
  }
};

// Obtener pedidos del usuario autenticado
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product", "name sku image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Obtener el detalle de un pedido del usuario autenticado
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "El ID del pedido no es válido",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    }).populate("items.product", "name sku image");

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Obtener todos los pedidos — solo administradores
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name lastname email")
      .populate("items.product", "name sku image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Error al obtener todos los pedidos:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Actualizar estado de un pedido — solo administradores
const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "El ID del pedido no es válido",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "El estado del pedido no es válido",
      });
    }

    session.startTransaction();

    const order = await Order.findById(id).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    if (order.status === "cancelled") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "El pedido ya está cancelado",
      });
    }

    /*if (order.status === "delivered" && status === "cancelled") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "No se puede cancelar un pedido entregado",
      });
    }*/

    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[order.status].includes(status)) {
      await session.abortTransaction();

      return res.status(400).json({
        message: `No se puede cambiar el pedido de ${order.status} a ${status}`,
      });
    }

    // Devolver stock cuando el pedido pasa a cancelado
    if (status === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          {
            session,
          },
        );
      }
    }

    order.status = status;

    await order.save({ session });

    await session.commitTransaction();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name lastname email")
      .populate("items.product", "name sku image");

    return res.status(200).json({
      message: "Estado del pedido actualizado correctamente",
      order: updatedOrder,
    });
    /*} catch (error) {
    await session.abortTransaction();

    console.error("Error al actualizar estado del pedido:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  } finally {
    session.endSession();
  }*/
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Error al actualizar estado del pedido:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
