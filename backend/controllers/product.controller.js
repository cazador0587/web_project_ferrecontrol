const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// Escapar caracteres especiales para búsquedas literales con regex
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeSku = (value) => value.trim().toUpperCase();

const isValidProductPrice = (value) => {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0.01 &&
    Number.isSafeInteger(Math.round(value * 100)) &&
    Math.abs(value * 100 - Math.round(value * 100)) < 1e-8
  );
};

const isValidStock = (value) => {
  return Number.isSafeInteger(value) && value >= 0;
};

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
    } = req.body ?? {};

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

    // Validar los tipos de los campos principales
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof sku !== "string" ||
      typeof category !== "string"
    ) {
      return res.status(400).json({
        message: "Los campos principales deben contener texto válido",
      });
    }

    const normalizedSku = normalizeSku(sku);

    if (!normalizedSku) {
      return res.status(400).json({
        message: "El SKU no puede estar vacío",
      });
    }

    // Validar el identificador de la categoría
    if (!mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        message: "Identificador de categoría no válido",
      });
    }

    // Validar el precio del producto
    if (!isValidProductPrice(price)) {
      return res.status(400).json({
        message: "El precio debe ser un número válido mayor o igual a 0.01",
      });
    }

    // Validar la cantidad disponible en inventario
    if (stock !== undefined && !isValidStock(stock)) {
      return res.status(400).json({
        message: "El stock debe ser un número entero mayor o igual a cero",
      });
    }

    // Validar el stock mínimo del producto
    if (minStock !== undefined && !isValidStock(minStock)) {
      return res.status(400).json({
        message:
          "El stock mínimo debe ser un número entero mayor o igual a cero",
      });
    }

    const existingProduct = await Product.findOne({
      sku: normalizedSku,
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
      sku: normalizedSku,
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
    // Detectar conflictos de índices únicos en MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        message: "El SKU ya está registrado",
      });
    }

    // Detectar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Los datos del producto no son válidos",
      });
    }

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

    // Validar que el parámetro de búsqueda sea un único texto
    if (search !== undefined && typeof search !== "string") {
      return res.status(400).json({
        message: "El parámetro de búsqueda debe ser un texto válido",
      });
    }

    // Limitar la longitud de las búsquedas del catálogo
    if (typeof search === "string" && search.trim().length > 100) {
      return res.status(400).json({
        message: "La búsqueda no puede superar los 100 caracteres",
      });
    }

    // Validar primero el tipo y el formato de los filtros de precio
    const decimalPricePattern = /^\d+(?:\.\d{1,2})?$/;

    if (minPrice !== undefined) {
      if (typeof minPrice !== "string" || minPrice.trim() === "") {
        return res.status(400).json({
          message: "El precio mínimo debe ser un número válido",
        });
      }

      if (!decimalPricePattern.test(minPrice)) {
        return res.status(400).json({
          message: "El precio mínimo debe tener un formato decimal válido",
        });
      }
    }

    if (maxPrice !== undefined) {
      if (typeof maxPrice !== "string" || maxPrice.trim() === "") {
        return res.status(400).json({
          message: "El precio máximo debe ser un número válido",
        });
      }

      if (!decimalPricePattern.test(maxPrice)) {
        return res.status(400).json({
          message: "El precio máximo debe tener un formato decimal válido",
        });
      }
    }

    // Convertir únicamente después de validar el formato
    const parsedMinPrice =
      minPrice !== undefined ? Number(minPrice) : undefined;

    const parsedMaxPrice =
      maxPrice !== undefined ? Number(maxPrice) : undefined;

    if (parsedMinPrice !== undefined && !Number.isFinite(parsedMinPrice)) {
      return res.status(400).json({
        message: "El precio mínimo debe ser un número válido",
      });
    }

    if (parsedMaxPrice !== undefined && !Number.isFinite(parsedMaxPrice)) {
      return res.status(400).json({
        message: "El precio máximo debe ser un número válido",
      });
    }

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      return res.status(400).json({
        message: "El precio mínimo no puede ser mayor que el precio máximo",
      });
    }

    // Validar la categoría cuando se incluya en los filtros
    if (
      category !== undefined &&
      (typeof category !== "string" ||
        category.trim() === "" ||
        !mongoose.isValidObjectId(category))
    ) {
      return res.status(400).json({
        message: "El ID de categoría no es válido",
      });
    }

    // Evitar pérdida de precisión en los filtros de precio
    if (
      parsedMinPrice !== undefined &&
      !Number.isSafeInteger(Math.round(parsedMinPrice * 100))
    ) {
      return res.status(400).json({
        message: "El precio mínimo supera el límite de precisión permitido",
      });
    }

    if (
      parsedMaxPrice !== undefined &&
      !Number.isSafeInteger(Math.round(parsedMaxPrice * 100))
    ) {
      return res.status(400).json({
        message: "El precio máximo supera el límite de precisión permitido",
      });
    }

    const filter = {
      isActive: { $ne: false },
    };

    if (typeof search === "string" && search.trim()) {
      const safeSearch = escapeRegex(search.trim());

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { sku: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (parsedMinPrice !== undefined) {
        filter.price.$gte = parsedMinPrice;
      }

      if (parsedMaxPrice !== undefined) {
        filter.price.$lte = parsedMaxPrice;
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

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identificador de producto no válido",
      });
    }

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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identificador de producto no válido",
      });
    }

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
    } = req.body ?? {};

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Validar los tipos de los campos de texto enviados
    if (
      (name !== undefined && typeof name !== "string") ||
      (description !== undefined && typeof description !== "string") ||
      (sku !== undefined && typeof sku !== "string") ||
      (category !== undefined && typeof category !== "string")
    ) {
      return res.status(400).json({
        message: "Los campos principales deben contener texto válido",
      });
    }

    const normalizedSku = sku !== undefined ? normalizeSku(sku) : undefined;

    if (normalizedSku !== undefined && !normalizedSku) {
      return res.status(400).json({
        message: "El SKU no puede estar vacío",
      });
    }

    // Validar el stock mínimo cuando se envíe
    if (minStock !== undefined && !isValidStock(minStock)) {
      return res.status(400).json({
        message:
          "El stock mínimo debe ser un número entero mayor o igual a cero",
      });
    }

    // Validar el stock cuando se envíe
    if (stock !== undefined && !isValidStock(stock)) {
      return res.status(400).json({
        message: "El stock debe ser un número entero mayor o igual a cero",
      });
    }

    // Validar el precio cuando se envíe
    if (price !== undefined && !isValidProductPrice(price)) {
      return res.status(400).json({
        message: "El precio debe ser un número válido mayor o igual a 0.01",
      });
    }

    // Validar el identificador de la categoría cuando se envíe
    if (category !== undefined && !mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        message: "Identificador de categoría no válido",
      });
    }

    if (normalizedSku !== undefined && normalizedSku !== product.sku) {
      const existingProduct = await Product.findOne({
        sku: normalizedSku,
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
        sku: normalizedSku,
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
    // Detectar conflictos de índices únicos en MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        message: "El SKU ya está registrado",
      });
    }

    // Detectar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Los datos del producto no son válidos",
      });
    }

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

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Identificador de producto no válido",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
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
    console.error("Error al desactivar producto:", error);

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