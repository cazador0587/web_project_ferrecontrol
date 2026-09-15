const Cart = require("../models/Cart");

// Obtener el carrito del usuario autenticado
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product", "name sku price stock image");

    // Si el usuario todavía no tiene carrito, crearlo
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    return res.status(200).json({
      cart,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Agregar producto al carrito
const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity === undefined) {
      return res.status(400).json({
        message: "El producto y la cantidad son obligatorios",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "La cantidad debe ser un número entero mayor que 0",
      });
    }

    const Product = require("../models/Product");

    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    if (productData.stock === 0) {
      return res.status(400).json({
        message: "El producto está agotado",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > productData.stock) {
        return res.status(400).json({
          message: "La cantidad solicitada supera el stock disponible",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      if (quantity > productData.stock) {
        return res.status(400).json({
          message: "La cantidad solicitada supera el stock disponible",
        });
      }

      cart.items.push({
        product,
        quantity,
      });
    }

    await cart.save();

    await cart.populate(
      "items.product",
      "name sku price stock image"
    );

    return res.status(200).json({
      message: "Producto agregado al carrito correctamente",
      cart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Actualizar cantidad de un producto en el carrito
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        message: "La cantidad es obligatoria",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "La cantidad debe ser un número entero mayor que 0",
      });
    }

    const Product = require("../models/Product");

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    if (product.stock === 0) {
      return res.status(400).json({
        message: "El producto está agotado",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "La cantidad solicitada supera el stock disponible",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Carrito no encontrado",
      });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "El producto no está en el carrito",
      });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate(
      "items.product",
      "name sku price stock image"
    );

    return res.status(200).json({
      message: "Cantidad actualizada correctamente",
      cart,
    });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Carrito no encontrado",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "El producto no está en el carrito",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate(
      "items.product",
      "name sku price stock image"
    );

    return res.status(200).json({
      message: "Producto eliminado del carrito correctamente",
      cart,
    });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};