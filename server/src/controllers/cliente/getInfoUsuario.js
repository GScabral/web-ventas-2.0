const { Cliente } = require('../../db');
const bcrypt = require('bcrypt');

const obtenerInfUsuario = async (correo, contraseña) => {
  try {
    const user = await Cliente.findOne({ where: { correo } });

    if (!user) {
      return { error: 'Credenciales inválidas', user: null };
    }

    // Verificar si la contraseña es válida utilizando bcrypt.compare
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      return { error: 'Credenciales inválidas', user: null };
    }

    // Retornar el ID y la información del usuario
    return { error: null, user: { id: user.id, nombre: user.nombre, correo: user.correo } };
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    return { error: 'Error al obtener la información del usuario', user: null };
  }
};

module.exports = obtenerInfUsuario;
