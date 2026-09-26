const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// Crear producto
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      specifications,
      description,
      sku,
      price,
      stock,
      minStock,
      image,
      category,
    } = req.body;

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
      brand,
      model,
      specifications,
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

// Obtener productos con búsqueda
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    // Validar precios
    if (minPrice !== undefined && Number.isNaN(Number(minPrice))) {
      return res.status(400).json({
        message: "El precio mínimo debe ser un número válido",
      });
    }

    if (maxPrice !== undefined && Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({
        message: "El precio máximo debe ser un número válido",
      });
    }

    if (minPrice !== undefined && Number(minPrice) < 0) {
      return res.status(400).json({
        message: "El precio mínimo no puede ser negativo",
      });
    }

    if (maxPrice !== undefined && Number(maxPrice) < 0) {
      return res.status(400).json({
        message: "El precio máximo no puede ser negativo",
      });
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        message: "El precio mínimo no puede ser mayor que el precio máximo",
      });
    }

    // Validar categoría
    if (category && !mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        message: "El ID de categoría no es válido",
      });
    }

    const filter = {
      isActive: { $ne: false },
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter)
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
      brand,
      model,
      specifications,
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
        brand,
        model,
        specifications,
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
      },
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto desactivado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al desactivar el producto",
      error: error.message,
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