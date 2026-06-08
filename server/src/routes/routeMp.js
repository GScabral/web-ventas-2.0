const express = require('express');
const router = express.Router();
const createPreference = require('../controllers/mp/mp');

// Ruta para crear preferencia de MercadoPago
router.post('/create_preference', createPreference);

module.exports = router;
