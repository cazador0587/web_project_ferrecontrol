const Product = require("../models/Product");
const Category = require("../models/Category");

// Crear producto
const createProduct = async (req, res) => {
  try {
    const { name, description, sku, price, stock, minStock, image, category } =
      req.body;

    if (
      !name ||
      !description ||
      !sku ||
      price === undefined ||
      stock === undefined ||
      minStock === undefined ||
      !category
    ) {
      return res.status(400).json({
        message: "Los campos obligatorios no están completos",
      });
    }

    const existingProduct = await Product.findOne({
      sku: sku.toUpperCase(),
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "El SKU ya está registrado",
      });
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        message: "La categoría no existe",
      });
    }

    const product = await Product.create({
      name,
      description,
      sku,
      price,
      stock,
      minStock,
      image,
      category,
    });

    return res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name description"
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      sku,
      price,
      stock,
      minStock,
      image,
      category,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    if (sku && sku.toUpperCase() !== product.sku) {
      const existingProduct = await Product.findOne({
        sku: sku.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(409).json({
          message: "El SKU ya está registrado",
        });
      }
    }

    if (category && category.toString() !== product.category.toString()) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          message: "La categoría no existe",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        sku,
        price,
        stock,
        minStock,
        image,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name description");

    return res.status(200).json({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      message: "Producto eliminado correctamente",
      product,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};