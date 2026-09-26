const mongoose = require("mongoose");

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
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
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
