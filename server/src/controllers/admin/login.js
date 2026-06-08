require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

async function getAdminPasswordHash() {
  if (ADMIN_PASSWORD_HASH) {
    return ADMIN_PASSWORD_HASH;
  }

  if (ADMIN_PASSWORD) {
    return await bcrypt.hash(ADMIN_PASSWORD, 10);
  }

  throw new Error('ADMIN_PASSWORD_HASH o ADMIN_PASSWORD no está configurado en el servidor');
}

async function loginAdmin({ correo, username, password }) {
  if (!password) {
    return { error: 'Contraseña requerida' };
  }

  if (!secretKey) {
    return { error: 'Clave secreta no configurada en el servidor' };
  }

  const hash = await getAdminPasswordHash();
  const isValidPassword = await bcrypt.compare(password, hash);

  if (!isValidPassword) {
    return { error: 'Credenciales incorrectas' };
  }

  if (ADMIN_EMAIL || ADMIN_USERNAME) {
    const emailMatches = ADMIN_EMAIL ? correo === ADMIN_EMAIL : true;
    const usernameMatches = ADMIN_USERNAME ? username === ADMIN_USERNAME : true;

    // Si se especificó correo o usuario, al menos uno debe coincidir.
    if ((ADMIN_EMAIL && !emailMatches) && (ADMIN_USERNAME && !usernameMatches)) {
      return { error: 'Credenciales incorrectas' };
    }
  }

  const token = jwt.sign({ isAdmin: true }, secretKey, { expiresIn: '12h' });
  return { token };
}

module.exports = loginAdmin;
