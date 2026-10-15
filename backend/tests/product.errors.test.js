const assert = require("node:assert/strict");
const { test } = require("node:test");

const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const createRequest = () => ({
  body: {
    name: "Producto de prueba",
    description: "Producto utilizado para comprobar errores",
    sku: "TEST-ERROR-001",
    price: 100,
    stock: 5,
    minStock: 1,
    category: "507f1f77bcf86cd799439011",
  },
});

const createResponse = () => ({
  statusCode: 200,
  body: null,

  status(code) {
    this.statusCode = code;
    return this;
  },

  json(data) {
    this.body = data;
    return this;
  },
});

test("createProduct responde 409 ante error MongoDB 11000", async () => {
  const originalFindOne = Product.findOne;
  const originalFindById = Category.findById;
  const originalCreate = Product.create;

  try {
    Product.findOne = async () => null;
    Category.findById = async () => ({
      _id: "507f1f77bcf86cd799439011",
    });

    Product.create = async () => {
      const error = new Error("Duplicate key");
      error.code = 11000;
      throw error;
    };

    const req = createRequest();
    const res = createResponse();

    await createProduct(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, "El SKU ya está registrado");
  } finally {
    Product.findOne = originalFindOne;
    Category.findById = originalFindById;
    Product.create = originalCreate;
  }
});

test("createProduct responde 400 ante ValidationError", async () => {
  const originalFindOne = Product.findOne;
  const originalFindById = Category.findById;
  const originalCreate = Product.create;

  try {
    Product.findOne = async () => null;
    Category.findById = async () => ({
      _id: "507f1f77bcf86cd799439011",
    });

    Product.create = async () => {
      const error = new Error("Product validation failed");
      error.name = "ValidationError";
      throw error;
    };

    const req = createRequest();
    const res = createResponse();

    await createProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Los datos del producto no son válidos");
  } finally {
    Product.findOne = originalFindOne;
    Category.findById = originalFindById;
    Product.create = originalCreate;
  }
});

test("updateProduct responde 409 ante error MongoDB 11000", async () => {
  const originalFindById = Product.findById;
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;

  try {
    Product.findById = async () => ({
      _id: "507f1f77bcf86cd799439012",
      sku: "TEST-ORIGINAL-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findByIdAndUpdate = () => {
      const error = new Error("Duplicate key");
      error.code = 11000;
      throw error;
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        price: 150,
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, "El SKU ya está registrado");
  } finally {
    Product.findById = originalFindById;
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test("updateProduct responde 400 ante ValidationError", async () => {
  const originalFindById = Product.findById;
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;

  try {
    Product.findById = async () => ({
      _id: "507f1f77bcf86cd799439012",
      sku: "TEST-ORIGINAL-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findByIdAndUpdate = () => {
      const error = new Error("Product validation failed");
      error.name = "ValidationError";
      throw error;
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        price: 150,
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Los datos del producto no son válidos");
  } finally {
    Product.findById = originalFindById;
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test("deleteProduct no expone detalles internos ante un error", async () => {
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;
  const originalConsoleError = console.error;

  try {
    Product.findByIdAndUpdate = async () => {
      throw new Error("Detalle interno de MongoDB");
    };

    // Evitar que el error simulado ensucie la salida de las pruebas
    console.error = () => {};

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
    };

    const res = createResponse();

    await deleteProduct(req, res);

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, "Error interno del servidor");
    assert.equal(
      Object.prototype.hasOwnProperty.call(res.body, "error"),
      false,
    );
    assert.equal(
      JSON.stringify(res.body).includes("Detalle interno de MongoDB"),
      false,
    );
  } finally {
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
    console.error = originalConsoleError;
  }
});

test("getProducts rechaza precios con más de dos decimales", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        minPrice: "10.123",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "El precio mínimo debe tener un formato decimal válido",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza enteros fuera del rango seguro", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        minPrice: "9007199254740993",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "El precio mínimo supera el límite de precisión permitido",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza parámetros de precio repetidos", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        minPrice: ["10", "20"],
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "El precio mínimo debe ser un número válido",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza rangos de precio invertidos", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        minPrice: "100",
        maxPrice: "10",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "El precio mínimo no puede ser mayor que el precio máximo",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts construye correctamente un filtro de precio válido", async () => {
  const originalFind = Product.find;

  let receivedFilter = null;

  try {
    Product.find = (filter) => {
      receivedFilter = filter;

      return {
        populate() {
          return this;
        },

        async sort() {
          return [];
        },
      };
    };

    const req = {
      query: {
        minPrice: "10.50",
        maxPrice: "100.50",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      products: [],
    });

    assert.deepEqual(receivedFilter, {
      isActive: { $ne: false },
      price: {
        $gte: 10.5,
        $lte: 100.5,
      },
    });
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza búsquedas repetidas", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        search: ["martillo", "taladro"],
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "El parámetro de búsqueda debe ser un texto válido",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza búsquedas superiores a 100 caracteres", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        search: "a".repeat(101),
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
      res.body.message,
      "La búsqueda no puede superar los 100 caracteres",
    );
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza categorías con ID inválido", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        category: "categoria-invalida",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "El ID de categoría no es válido");
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts escapa caracteres especiales de búsqueda", async () => {
  const originalFind = Product.find;

  let receivedFilter = null;

  try {
    Product.find = (filter) => {
      receivedFilter = filter;

      return {
        populate() {
          return this;
        },

        async sort() {
          return [];
        },
      };
    };

    const req = {
      query: {
        search: "martillo.*",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      products: [],
    });

    assert.deepEqual(receivedFilter, {
      isActive: { $ne: false },
      $or: [
        {
          name: {
            $regex: "martillo\\.\\*",
            $options: "i",
          },
        },
        {
          sku: {
            $regex: "martillo\\.\\*",
            $options: "i",
          },
        },
      ],
    });
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts construye correctamente el filtro de categoría", async () => {
  const originalFind = Product.find;

  let receivedFilter = null;

  try {
    Product.find = (filter) => {
      receivedFilter = filter;

      return {
        populate() {
          return this;
        },

        async sort() {
          return [];
        },
      };
    };

    const categoryId = "507f1f77bcf86cd799439011";

    const req = {
      query: {
        category: categoryId,
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      products: [],
    });

    assert.deepEqual(receivedFilter, {
      isActive: { $ne: false },
      category: categoryId,
    });
  } finally {
    Product.find = originalFind;
  }
});

test("createProduct normaliza el SKU antes de consultar y guardar", async () => {
  const originalFindOne = Product.findOne;
  const originalCreate = Product.create;
  const originalCategoryFindById = Category.findById;

  let consultedSku;
  let savedSku;

  try {
    Product.findOne = async (filter) => {
      consultedSku = filter.sku;
      return null;
    };

    Category.findById = async () => ({ _id: "507f1f77bcf86cd799439011" });

    Product.create = async (data) => {
      savedSku = data.sku;
      return data;
    };

    const req = createRequest();
    req.body.sku = " mar-001 ";

    const res = createResponse();

    await createProduct(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(consultedSku, "MAR-001");
    assert.equal(savedSku, "MAR-001");
  } finally {
    Product.findOne = originalFindOne;
    Product.create = originalCreate;
    Category.findById = originalCategoryFindById;
  }
});

test("updateProduct normaliza el SKU antes de consultar y guardar", async () => {
  const originalFindById = Product.findById;
  const originalFindOne = Product.findOne;
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;

  let consultedSku;
  let savedSku;

  try {
    Product.findById = async () => ({
      sku: "ANT-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findOne = async (filter) => {
      consultedSku = filter.sku;
      return null;
    };

    Product.findByIdAndUpdate = (id, data) => {
      savedSku = data.sku;

      return {
        async populate() {
          return data;
        },
      };
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        sku: " mar-002 ",
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(consultedSku, "MAR-002");
    assert.equal(savedSku, "MAR-002");
  } finally {
    Product.findById = originalFindById;
    Product.findOne = originalFindOne;
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test("createProduct rechaza un SKU compuesto solo por espacios", async () => {
  const originalFindOne = Product.findOne;

  try {
    Product.findOne = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = createRequest();
    req.body.sku = "   ";

    const res = createResponse();

    await createProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "El SKU no puede estar vacío");
  } finally {
    Product.findOne = originalFindOne;
  }
});

test("updateProduct rechaza un SKU compuesto solo por espacios", async () => {
  const originalFindById = Product.findById;
  const originalFindOne = Product.findOne;

  try {
    Product.findById = async () => ({
      sku: "MAR-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findOne = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        sku: "   ",
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "El SKU no puede estar vacío");
  } finally {
    Product.findById = originalFindById;
    Product.findOne = originalFindOne;
  }
});

test("createProduct rechaza precios con más de dos decimales", async () => {
  const originalFindOne = Product.findOne;

  try {
    Product.findOne = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = createRequest();
    req.body.price = 10.123;

    const res = createResponse();

    await createProduct(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    Product.findOne = originalFindOne;
  }
});

test("updateProduct rechaza cantidades de inventario inseguras", async () => {
  const originalFindById = Product.findById;
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;

  try {
    Product.findById = async () => ({
      sku: "MAR-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findByIdAndUpdate = () => {
      throw new Error("No debe actualizar MongoDB");
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        stock: Number.MAX_SAFE_INTEGER + 1,
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    Product.findById = originalFindById;
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test("updateProduct rechaza precios con más de dos decimales", async () => {
  const originalFindById = Product.findById;
  const originalFindByIdAndUpdate = Product.findByIdAndUpdate;

  try {
    Product.findById = async () => ({
      sku: "MAR-001",
      category: "507f1f77bcf86cd799439011",
    });

    Product.findByIdAndUpdate = () => {
      throw new Error("No debe actualizar MongoDB");
    };

    const req = {
      params: {
        id: "507f1f77bcf86cd799439012",
      },
      body: {
        price: 10.123,
      },
    };

    const res = createResponse();

    await updateProduct(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    Product.findById = originalFindById;
    Product.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test("getProducts rechaza precios cuyos centavos exceden el rango seguro", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        minPrice: "100000000000000.00",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts rechaza maxPrice cuyos centavos exceden el rango seguro", async () => {
  const originalFind = Product.find;

  try {
    Product.find = () => {
      throw new Error("No debe consultar MongoDB");
    };

    const req = {
      query: {
        maxPrice: "100000000000000.00",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    Product.find = originalFind;
  }
});

test("getProducts acepta filtros de precio con dos decimales", async () => {
  const originalFind = Product.find;
  let capturedFilter;

  try {
    Product.find = (filter) => {
      capturedFilter = filter;

      return {
        populate() {
          return this;
        },
        sort: async () => [],
      };
    };

    const req = {
      query: {
        minPrice: "10.25",
        maxPrice: "99.99",
      },
    };

    const res = createResponse();

    await getProducts(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(capturedFilter.price, {
      $gte: 10.25,
      $lte: 99.99,
    });
  } finally {
    Product.find = originalFind;
  }
});