const bcrypt = require("bcryptjs");

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

module.exports = {
  register,
};
