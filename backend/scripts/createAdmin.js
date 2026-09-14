const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDatabase = require("../config/database");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDatabase();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("El usuario administrador ya existe.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Administrador",
      lastname: "FerreControl",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Administrador creado correctamente:");
    console.log({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error al crear administrador:", error);
    process.exit(1);
  }
};

createAdmin();
