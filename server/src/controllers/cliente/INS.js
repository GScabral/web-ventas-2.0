require('dotenv').config();
const { Cliente } = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Mismo mensaje genérico para "no existe el correo" y "contraseña
// incorrecta": si fueran distintos, alguien podría usar el login para
// averiguar qué correos están registrados (probando de a uno y viendo
// cuál da un mensaje distinto).
const ERROR_CREDENCIALES = 'Correo o contraseña incorrectos';

const inicioSesion = async (correo, contraseña) => {
  try {
    // Buscar al usuario por su correo electrónico
    const user = await Cliente.findOne({ where: { correo } });

    if (!user) {
      return { error: ERROR_CREDENCIALES };
    }

    // Verificar si la contraseña es válida utilizando bcrypt.compare
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      return { error: ERROR_CREDENCIALES };
    }

    // Antes acá había una rama que, si correo/contraseña coincidían con
    // ADMIN_EMAIL/ADMIN_PASSWORD, emitía un token con isAdmin: true desde
    // el login de CLIENTE. El admin ya tiene su propio flujo de login
    // separado (controllers/admin/login.js) — mezclar los dos dominios
    // de auth acá no servía para nada real (para que disparara, hacía
    // falta además una fila en la tabla Cliente con ese mismo correo y
    // una contraseña hasheada que coincidiera) y era una fuente de
    // confusión. Se saca.
    //
    // Generar un token JWT si las credenciales son válidas.
    // OJO: el modelo Cliente NO tiene un campo "id" — su primary key se
    // llama "id_cliente". Antes esto firmaba el token con "user.id"
    // (undefined siempre), así que todo token de cliente emitido tenía
    // userId: undefined. verificarTokenCliente lo rechazaba siempre con
    // 403 "Token inválido" — por eso /pedido/mis-pedidos nunca funcionó,
    // ni siquiera con un login recién hecho.
    const token = jwt.sign({ userId: user.id_cliente }, secretKey, { expiresIn: '12h' });
    const idU = user.id_cliente;

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