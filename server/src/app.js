const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path'); // Importa el módulo path
const routes = require('./routes/index.js');
const upload = require("../multerConfig.js");


require('./db.js');

const server = express();
server.name = 'Server';


server.use('/uploads', express.static(path.join(__dirname, '../uploads')));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

server.use(cors()); // Aplicar el middleware cors aquí, antes de otros middlewares

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3005');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  next();
});
server.use('/', routes);
// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;