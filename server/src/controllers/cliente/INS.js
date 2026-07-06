require('dotenv').config();
const { Cliente } = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const inicioSesion = async (correo, contraseña) => {
  try {
    // Buscar al usuario por su correo electrónico
    const user = await Cliente.findOne({ where: { correo } });

    if (!user) {
      // Usuario no encontrado
      return { error: 'El correo electrónico es incorrecto' };
    }

    // Verificar si la contraseña es válida utilizando bcrypt.compare
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      // Contraseña incorrecta
      return { error: 'La contraseña es incorrecta' };
    }

    // Verificar si el correo y la contraseña coinciden con los valores predeterminados en el archivo .env
    if (correo === process.env.ADMIN_EMAIL && contraseña === process.env.ADMIN_PASSWORD) {
      // Generar un token JWT para el usuario administrador
      const token = jwt.sign({ userId: user.id, isAdmin: true }, secretKey, { expiresIn: '12h' });
      return { token };
    }

    // Generar un token JWT si las credenciales son válidas pero no son para el administrador
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '12h' });
    const idU=user.id

    // Además del token, mandamos los datos básicos del cliente. Antes
    // solo viajaba { token, idU }, así que el front no tenía forma de
    // saber el nombre/dirección del cliente sin pedirlo aparte — se usa
    // para precargar el checkout la próxima vez que compre.
    return {
      token,
      idU,
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion,
      correo: user.correo,
    };
  } catch (error) {
    // Capturar errores específicos y devolver un mensaje genérico
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en el inicio de sesión:', error);
    }
    return { error: 'Error al iniciar sesión. Contacta al administrador.' };
  }
};

module.exports = inicioSesion;