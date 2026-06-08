// middleware/auth.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function verificarTokenAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarTokenAdmin };
