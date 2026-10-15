const test = require("node:test");
const assert = require("node:assert/strict");

const Product = require("../models/Product");

const validProduct = () => ({
  name: "Martillo de acero",
  description: "Martillo para trabajos de construcción",
  sku: "MAR-001",
  price: 125.5,
  stock: 10,
  minStock: 2,
  category: "507f1f77bcf86cd799439011",
});

test("Product acepta precios e inventario válidos", async () => {
  const product = new Product(validProduct());

  await assert.doesNotReject(product.validate());
});

test("Product rechaza precios con más de dos decimales", async () => {
  const product = new Product({
    ...validProduct(),
    price: 10.123,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.price);
    return true;
  });
});

test("Product rechaza precios menores a 0.01", async () => {
  const product = new Product({
    ...validProduct(),
    price: 0,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.price);
    return true;
  });
});

test("Product rechaza stock fraccionario", async () => {
  const product = new Product({
    ...validProduct(),
    stock: 2.5,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.stock);
    return true;
  });
});

test("Product rechaza stock fuera del rango seguro", async () => {
  const product = new Product({
    ...validProduct(),
    stock: Number.MAX_SAFE_INTEGER + 1,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.stock);
    return true;
  });
});

test("Product rechaza stock mínimo fraccionario", async () => {
  const product = new Product({
    ...validProduct(),
    minStock: 1.5,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.minStock);
    return true;
  });
});

test("Product rechaza stock mínimo fuera del rango seguro", async () => {
  const product = new Product({
    ...validProduct(),
    minStock: Number.MAX_SAFE_INTEGER + 1,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.minStock);
    return true;
  });
});

test("Product acepta el precio mínimo de 0.01", async () => {
  const product = new Product({
    ...validProduct(),
    price: 0.01,
  });

  await assert.doesNotReject(product.validate());
});

test("Product acepta precios con dos decimales", async () => {
  const product = new Product({
    ...validProduct(),
    price: 10.99,
  });

  await assert.doesNotReject(product.validate());
});

test("Product acepta resultados decimales con imprecisión de JavaScript", async () => {
  const product = new Product({
    ...validProduct(),
    price: 0.1 + 0.2,
  });

  await assert.doesNotReject(product.validate());
});

test("Product rechaza precios con centavos fuera del rango seguro", async () => {
  const product = new Product({
    ...validProduct(),
    price: 100000000000000,
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.price);
    return true;
  });
});