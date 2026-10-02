require("dotenv").config();

const mongoose = require("mongoose");
const connectDatabase = require("../config/database");
const Category = require("../models/Category");
const Product = require("../models/Product");

const productData = [
  {
    name: "Juego de brocas para metal",
    brand: "Genérica",
    model: "HSS 1-6 mm",
    specifications: [
      {
        label: "Material",
        value: "Acero HSS",
      },
      {
        label: "Rango de diámetros",
        value: "1–6 mm",
      },
      {
        label: "Uso",
        value: "Perforación de metal",
      },
    ],
    description:
      "Juego de brocas de acero de alta velocidad para perforaciones en metal y otros materiales.",
    sku: "ACC-001",
    price: 289.9,
    stock: 18,
    minStock: 5,
    image: "/images/products/acc-001.webp",
    category: "Accesorios",
  },

  {
    name: "Disco de corte para metal",
    brand: "Genérica",
    model: "115 x 1.0 mm",
    specifications: [
      {
        label: "Diámetro",
        value: "115 mm",
      },
      {
        label: "Espesor",
        value: "1.0 mm",
      },
      {
        label: "Material de trabajo",
        value: "Metal",
      },
      {
        label: "Uso",
        value: "Corte con esmeriladora angular",
      },
    ],
    description:
      "Disco abrasivo para corte de acero y otros metales, compatible con esmeriladoras angulares.",
    sku: "ACC-002",
    price: 49.9,
    stock: 35,
    minStock: 10,
    image: "/images/products/acc-002.webp",
    category: "Accesorios",
  },

  {
    name: "Extensión eléctrica de 5 metros",
    brand: "Genérica",
    model: "5 m aterrizada",
    specifications: [
      {
        label: "Longitud",
        value: "5 m",
      },
      {
        label: "Tipo de conexión",
        value: "Aterrizada",
      },
      {
        label: "Uso",
        value: "Doméstico y profesional",
      },
    ],
    description:
      "Extensión eléctrica de uso doméstico y profesional con cable resistente y conexión aterrizada.",
    sku: "ELE-001",
    price: 219.9,
    stock: 14,
    minStock: 5,
    image: "/images/products/ele-001.webp",
    category: "Electricidad",
  },

  {
    name: "Contacto dúplex",
    brand: "Genérica",
    model: "2P+T",
    specifications: [
      {
        label: "Configuración",
        value: "Dúplex",
      },
      {
        label: "Conexión",
        value: "2P+T",
      },
      {
        label: "Uso",
        value: "Residencial y comercial",
      },
    ],
    description:
      "Contacto eléctrico dúplex para instalaciones residenciales y comerciales.",
    sku: "ELE-002",
    price: 59.9,
    stock: 4,
    minStock: 5,
    image: "/images/products/ele-002.webp",
    category: "Electricidad",
  },

  {
    name: "Cemento gris 50 kg",
    brand: "Genérica",
    model: "Uso general 50 kg",
    specifications: [
      {
        label: "Presentación",
        value: "50 kg",
      },
      {
        label: "Color",
        value: "Gris",
      },
      {
        label: "Tipo",
        value: "Uso general",
      },
      {
        label: "Uso",
        value: "Construcción y albañilería",
      },
    ],
    description:
      "Cemento gris de uso general para trabajos de construcción, reparación y albañilería.",
    sku: "MAT-001",
    price: 249.9,
    stock: 25,
    minStock: 8,
    image: "/images/products/mat-001.webp",
    category: "Materiales de construcción",
  },

  {
    name: "Mortero para construcción 40 kg",
    brand: "Genérica",
    model: "Uso general 40 kg",
    specifications: [
      {
        label: "Presentación",
        value: "40 kg",
      },
      {
        label: "Tipo",
        value: "Mortero preparado",
      },
      {
        label: "Uso",
        value: "Mampostería y asentado",
      },
      {
        label: "Aplicación",
        value: "Construcción y reparaciones",
      },
    ],
    description:
      "Mortero preparado para trabajos de mampostería, asentado y reparaciones generales.",
    sku: "MAT-002",
    price: 179.9,
    stock: 12,
    minStock: 5,
    image: "/images/products/mat-002.webp",
    category: "Materiales de construcción",
  },

  {
    name: "Pintura vinílica blanca 4 L",
    brand: "Genérica",
    model: "Vinílica blanca 4 L",
    specifications: [
      {
        label: "Tipo",
        value: "Pintura vinílica",
      },
      {
        label: "Color",
        value: "Blanco",
      },
      {
        label: "Presentación",
        value: "4 L",
      },
      {
        label: "Uso",
        value: "Interiores y exteriores",
      },
    ],
    description:
      "Pintura vinílica blanca para interiores y exteriores con acabado uniforme.",
    sku: "PIN-001",
    price: 399.9,
    stock: 10,
    minStock: 4,
    image: "/images/products/pin-001.webp",
    category: "Pinturas",
  },

  {
    name: "Rodillo para pintura 9 pulgadas",
    brand: "Genérica",
    model: "9 pulgadas",
    specifications: [
      {
        label: "Ancho",
        value: "9 pulgadas",
      },
      {
        label: "Tipo",
        value: "Rodillo para pintura",
      },
      {
        label: "Uso",
        value: "Aplicación de pinturas y recubrimientos",
      },
    ],
    description:
      "Rodillo de uso general para aplicación uniforme de pinturas y recubrimientos.",
    sku: "PIN-002",
    price: 89.9,
    stock: 22,
    minStock: 6,
    image: "/images/products/pin-002.webp",
    category: "Pinturas",
  },

  {
    name: "Tubo PVC hidráulico 1/2 pulgada",
    brand: "Genérica",
    model: "PVC hidráulico 1/2 pulgada",
    specifications: [
      {
        label: "Material",
        value: "PVC",
      },
      {
        label: "Diámetro",
        value: "1/2 pulgada",
      },
      {
        label: "Tipo",
        value: "Hidráulico",
      },
      {
        label: "Uso",
        value: "Instalaciones hidráulicas",
      },
    ],
    description:
      "Tubo de PVC para instalaciones hidráulicas residenciales y trabajos de mantenimiento.",
    sku: "PLO-001",
    price: 79.9,
    stock: 30,
    minStock: 10,
    image: "/images/products/plo-001.webp",
    category: "Plomería",
  },

  {
    name: "Llave de esfera 1/2 pulgada",
    brand: "Genérica",
    model: "1/2 pulgada",
    specifications: [
      {
        label: "Tipo",
        value: "Válvula de esfera",
      },
      {
        label: "Medida",
        value: "1/2 pulgada",
      },
      {
        label: "Uso",
        value: "Control de flujo de agua",
      },
      {
        label: "Aplicación",
        value: "Instalaciones hidráulicas",
      },
    ],
    description:
      "Válvula de esfera para controlar el flujo de agua en instalaciones hidráulicas.",
    sku: "PLO-002",
    price: 119.9,
    stock: 3,
    minStock: 5,
    image: "/images/products/plo-002.webp",
    category: "Plomería",
  },

  {
    name: "Lentes de seguridad transparentes",
    brand: "Genérica",
    model: "Protección transparente",
    specifications: [
      {
        label: "Tipo",
        value: "Lentes de seguridad",
      },
      {
        label: "Color",
        value: "Transparente",
      },
      {
        label: "Uso",
        value: "Protección ocular",
      },
      {
        label: "Aplicación",
        value: "Construcción y mantenimiento",
      },
    ],
    description:
      "Lentes de protección para trabajos de construcción, mantenimiento y uso de herramientas.",
    sku: "SEG-001",
    price: 99.9,
    stock: 20,
    minStock: 5,
    image: "/images/products/seg-001.webp",
    category: "Seguridad",
  },

  {
    name: "Guantes de trabajo reforzados",
    brand: "Genérica",
    model: "Uso general reforzado",
    specifications: [
      {
        label: "Tipo",
        value: "Guantes de trabajo",
      },
      {
        label: "Diseño",
        value: "Reforzado",
      },
      {
        label: "Uso",
        value: "Protección de manos",
      },
      {
        label: "Aplicación",
        value: "Manipulación de herramientas y materiales",
      },
    ],
    description:
      "Guantes de protección para manipulación de herramientas y materiales de construcción.",
    sku: "SEG-002",
    price: 149.9,
    stock: 0,
    minStock: 5,
    image: "/images/products/seg-002.webp",
    category: "Seguridad",
  },

  {
    name: "Tornillo galvanizado 1/4 x 2 pulgadas",
    brand: "Genérica",
    model: "1/4 x 2 pulgadas",
    specifications: [
      {
        label: "Tipo",
        value: "Tornillo",
      },
      {
        label: "Acabado",
        value: "Galvanizado",
      },
      {
        label: "Medida",
        value: "1/4 x 2 pulgadas",
      },
      {
        label: "Uso",
        value: "Fijaciones y construcción",
      },
    ],

    description:
      "Tornillo galvanizado de uso general para fijaciones y trabajos de construcción.",
    sku: "TOR-001",
    price: 8.5,
    stock: 100,
    minStock: 25,
    image: "/images/products/tor-001.webp",
    category: "Tornillería",
  },

  {
    name: "Tuerca hexagonal 1/4 pulgada",
    brand: "Genérica",
    model: "Hexagonal 1/4 pulgada",
    specifications: [
      {
        label: "Tipo",
        value: "Tuerca hexagonal",
      },
      {
        label: "Acabado",
        value: "Galvanizado",
      },
      {
        label: "Medida",
        value: "1/4 pulgada",
      },
      {
        label: "Uso",
        value: "Ensambles y fijaciones mecánicas",
      },
    ],
    description:
      "Tuerca hexagonal galvanizada para ensambles, reparaciones y fijaciones mecánicas.",
    sku: "TOR-002",
    price: 4.5,
    stock: 80,
    minStock: 20,
    image: "/images/products/tor-002.webp",
    category: "Tornillería",
  },

  {
    name: "Martillo de uña con mango de fibra",
    brand: "Genérica",
    model: "Mango de fibra",
    specifications: [
      {
        label: "Tipo",
        value: "Martillo de uña",
      },
      {
        label: "Mango",
        value: "Fibra",
      },
      {
        label: "Uso",
        value: "Carpintería y construcción",
      },
    ],
    description:
      "Martillo de uña con mango de fibra para trabajos de carpintería, construcción y reparaciones generales.",
    sku: "MAR-001",
    price: 189.9,
    stock: 16,
    minStock: 5,
    image: "/images/products/mar-001.webp",
    category: "Herramientas",
  },

  {
    name: "Martillo de uña con mango tubular",
    brand: "Genérica",
    model: "Mango tubular",
    specifications: [
      {
        label: "Tipo",
        value: "Martillo de uña",
      },
      {
        label: "Mango",
        value: "Tubular",
      },
      {
        label: "Uso",
        value: "Carpintería y construcción",
      },
    ],
    description:
      "Martillo de uña con mango tubular para trabajos de carpintería, construcción y reparaciones generales.",
    sku: "MAR-002",
    price: 169.9,
    stock: 12,
    minStock: 5,
    image: "/images/products/mar-002.webp",
    category: "Herramientas",
  },
];

const seedProducts = async () => {
  try {
    await connectDatabase();

    const categoryNames = [
      ...new Set(productData.map((product) => product.category)),
    ];

    const categoryList = await Category.find({
      name: { $in: categoryNames },
    });

    const categoryMap = new Map(
      categoryList.map((category) => [category.name, category._id]),
    );

    const missingCategories = categoryNames.filter(
      (categoryName) => !categoryMap.has(categoryName),
    );

    if (missingCategories.length > 0) {
      throw new Error(`Faltan categorías: ${missingCategories.join(", ")}`);
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const product of productData) {
      const { category, ...productFields } = product;

      const productDocument = {
        ...productFields,
        category: categoryMap.get(category),
        isActive: true,
      };

      const existingProduct = await Product.findOne({
        sku: product.sku,
      });

      if (existingProduct) {
        await Product.updateOne(
          { sku: product.sku },
          { $set: productDocument },
        );

        console.log(`Actualizado: ${product.sku} - ${product.name}`);
        updatedCount += 1;
        continue;
      }

      await Product.create(productDocument);

      console.log(`Creado: ${product.sku} - ${product.name}`);
      createdCount += 1;
    }

    console.log("");
    console.log("Seed de productos completado.");
    console.log(`Productos creados: ${createdCount}`);
    console.log(`Productos actualizados: ${updatedCount}`);
  } catch (error) {
    console.error("Error al crear productos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
