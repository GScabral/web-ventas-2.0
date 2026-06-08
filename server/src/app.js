const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/index.js');
const upload = require("../multerConfig.js");


require('./db.js');

const server = express();
server.name = 'Server';

// Middleware
server.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors()); // Habilita CORS de forma genérica para producción

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
