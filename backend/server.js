const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3001;

// Conectar a MongoDB
connectDatabase();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "FerreControl API funcionando correctamente",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`FerreControl API ejecutándose en http://localhost:${PORT}`);
});
