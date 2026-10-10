const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body ?? {};

    // Validar que todos los campos estén presentes
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // Validar el tipo de los campos recibidos
    if (
      typeof name !== "string" ||
      typeof lastname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Los campos deben contener texto válido",
      });
    }

    // Normalizar y validar el correo electrónico
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "El formato del correo electrónico no es válido",
      });
    }

    // Validar la longitud mínima de la contraseña original
    if (password.length < 8) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "El correo electrónico ya está registrado",
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      lastname,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Respuesta sin enviar la contraseña
    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Manejar correos duplicados detectados por MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        message: "El correo electrónico ya está registrado",
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    // Validar que todos los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    // Validar los tipos de datos
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "El correo y la contraseña deben ser texto válido",
      });
    }

    // Normalizar el correo electrónico
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario incluyendo la contraseña
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos",
      });
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos",
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();

    return res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Error al obtener la cantidad de usuarios:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name lastname email role createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body ?? {};

    // Validar el identificador del usuario
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identificador de usuario no válido",
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        message: "No puedes modificar tu propio rol",
      });
    }

    if (!["client", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Rol de usuario no válido",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("name lastname email role createdAt updatedAt");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Rol de usuario actualizado correctamente",
      user,
    });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getUserCount,
  getUsers,
  updateUserRole,
};
