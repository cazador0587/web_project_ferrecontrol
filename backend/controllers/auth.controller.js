const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });

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
      email,
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
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    // Buscar usuario incluyendo la contraseña
    const user = await User.findOne({ email }).select("+password");

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
    const users = await User.find().sort({ createdAt: -1 });

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
    const { role } = req.body;

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
      {
        new: true,
        runValidators: true,
      },
    );

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
