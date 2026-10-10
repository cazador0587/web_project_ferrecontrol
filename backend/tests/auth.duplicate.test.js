const assert = require("node:assert/strict");
const { test } = require("node:test");

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { register } = require("../controllers/auth.controller");

test("register responde 409 ante error MongoDB 11000", async () => {
  const originalFindOne = User.findOne;
  const originalHash = bcrypt.hash;
  const originalCreate = User.create;

  try {
    User.findOne = async () => null;
    bcrypt.hash = async () => "hash-simulado";

    User.create = async () => {
      const error = new Error("Duplicate key");
      error.code = 11000;
      throw error;
    };

    const req = {
      body: {
        name: "Usuario",
        lastname: "Prueba",
        email: "duplicado@example.com",
        password: "Prueba12345",
      },
    };

    const res = {
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
    };

    await register(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, "El correo electrónico ya está registrado");
  } finally {
    User.findOne = originalFindOne;
    bcrypt.hash = originalHash;
    User.create = originalCreate;
  }
});
