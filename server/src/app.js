const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes/index.js');
const upload = require("../multerConfig.js");


require('./db.js');

const server = express();
server.name = 'Server';

// Orígenes desde los que se permite llamar a la API. En producción, el
// origen real del frontend (CLIENT_URL) viene de una variable de entorno;
// los demás son fallbacks para no romper nada si todavía no se configuró.
// Para permitir más de un dominio, separar con comas en CLIENT_URL.
const defaultOrigins = [
  'https://amoremio.onrender.com',
  'http://localhost:5173',
  'http://localhost:3005',
];

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Sin "origin" (curl, Postman, requests del propio servidor) se permite:
    // no hay navegador de por medio, así que no aplica la protección de CORS.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS bloqueado para origen no permitido: ${origin}`);
    return callback(new Error('No permitido por CORS'));
  },
  credentials: true,
};

// Middleware
server.use(
  helmet({
    // El frontend está en otro dominio (Render) y consume imágenes desde
    // Cloudinary y desde /uploads de este mismo servidor; la política por
    // defecto de helmet para recursos cross-origin bloquearía eso.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // No servimos HTML propio que dependa de un Content-Security-Policy
    // estricto (el frontend es una SPA aparte); lo dejamos desactivado
    // para no romper nada hasta poder definir una política a medida.
    contentSecurityPolicy: false,
  })
);
server.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors(corsOptions));

// Rutas
server.use('/', routes);

// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Ocurrió un error inesperado';
  const details = err.details || undefined;
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(status).json({
    error: true,
    message,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = server;