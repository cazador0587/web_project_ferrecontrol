const mongoose = require("mongoose");

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

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    brand: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    model: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },

    specifications: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        value: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator: isValidProductPrice,
        message: "El precio debe tener máximo dos decimales y ser válido",
      },
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: isValidStock,
        message:
          "El stock debe ser un número entero seguro mayor o igual a cero",
      },
    },

    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: isValidStock,
        message:
          "El stock mínimo debe ser un número entero seguro mayor o igual a cero",
      },
    },

    image: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
