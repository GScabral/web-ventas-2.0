// validacion.js
const { body } = require('express-validator');

const validarRegistroCliente = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage('El nombre no debe contener caracteres especiales'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage('El apellido no debe contener caracteres especiales'),
  body('direccion')
    .notEmpty().withMessage('La dirección es obligatoria'),
  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Correo inválido'),
  body('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  // info_contacto se pedía acá antes, pero el modelo Cliente nunca tuvo
  // esa columna (ver models/clientes.js) — se validaba un campo que
  // después no se guardaba en ningún lado. Se saca del requisito.
];

module.exports = {
  validarRegistroCliente,
};
