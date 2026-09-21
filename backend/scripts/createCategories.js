require("dotenv").config();

const connectDatabase = require("../config/database");
const Category = require("../models/Category");

const categories = [
  {
    name: "Herramientas",
    description: "Herramientas manuales y eléctricas.",
  },
  {
    name: "Tornillería",
    description: "Tornillos, tuercas, rondanas y elementos de fijación.",
  },
  {
    name: "Electricidad",
    description: "Materiales y accesorios para instalaciones eléctricas.",
  },
  {
    name: "Plomería",
    description: "Materiales y accesorios para instalaciones hidráulicas.",
  },
  {
    name: "Pinturas",
    description: "Pinturas, recubrimientos y accesorios.",
  },
  {
    name: "Materiales de construcción",
    description: "Materiales básicos para construcción y reparación.",
  },
  {
    name: "Accesorios",
    description: "Accesorios y complementos para trabajos de ferretería.",
  },
];

const createCategories = async () => {
  try {
    await connectDatabase();

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({
        name: categoryData.name,
      });

      if (existingCategory) {
        console.log(`La categoría "${categoryData.name}" ya existe.`);
        continue;
      }

      await Category.create(categoryData);

      console.log(`Categoría "${categoryData.name}" creada correctamente.`);
    }

    console.log("Proceso de categorías finalizado.");
    process.exit(0);
  } catch (error) {
    console.error("Error al crear las categorías:", error);
    process.exit(1);
  }
};

createCategories();
