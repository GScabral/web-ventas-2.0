const { Router } = require("express");
require('dotenv').config();
const rateLimit = require("express-rate-limit");

const createAdmin = require("../controllers/admin/admin")
const loginAdmin = require("../controllers/admin/login");
const actualizarStock = require("../controllers/admin/patchAdminProduc");
const enviarCorreo = require("../controllers/correo/correo");
const { verificarTokenAdmin } = require("../middleware/auth");


const router = Router();

// Frena los intentos de fuerza bruta contra el login de admin: como solo
// hay un usuario admin (sin bloqueo de cuenta posible), esto es la única
// defensa real contra alguien probando contraseñas en bucle.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP cada 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Demasiados intentos de inicio de sesión. Probá de nuevo en 15 minutos."
  },
});

router.post("/NewAdmin", verificarTokenAdmin, async (req, res) => {
  try {
    const nuevoAdmin = await createAdmin(req.body);

    if (nuevoAdmin && nuevoAdmin.error) {
      // Manejo de errores específicos de la creación de administradores
      return res.status(400).json({ error: nuevoAdmin.error });
    } else {
      return res.status(200).json(nuevoAdmin);
    }
  } catch (error) {
    // Manejo de errores genéricos del servidor
    console.error("Error en la ruta /NewAdmin:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});



router.patch("/cambioAdmin/:id", verificarTokenAdmin, async (req, res) => {
  try {
    const productoActualizado = await actualizarStock(req.params.id, req.body); // Pasar todos los datos del producto
    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al cambiar:", error);
    res.status(500).json({ error: "Error al cambiar el producto" });
  }
});

router.post('/confirmacionPedido', verificarTokenAdmin, async (req, res) => {
  try {
    const { idPedido, infoPedido, correo, total } = req.body;


    await enviarCorreo(idPedido, infoPedido, correo, total);

    res.status(200).send('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('❌ Error al enviar el correo electrónico:', error);

    res.status(500).json({
      message: 'Error al enviar el correo electrónico',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: process.env.NODE_ENV === 'development' ? (error.code || null) : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});



router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { correo, username, password } = req.body;
    const authResult = await loginAdmin({ correo, username, password });

    if (authResult.token) {
      return res.status(200).json({ success: true, token: authResult.token });
    }

    return res.status(401).json({ success: false, error: authResult.error || 'Autenticación fallida' });
  } catch (error) {
    console.error('Error en la ruta /login:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

router.post('/loginc', loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    const authResult = await loginAdmin({ password });

    if (authResult.token) {
      return res.status(200).json({ success: true, token: authResult.token });
    }

    return res.status(401).json({ success: false, error: authResult.error || 'Autenticación fallida' });
  } catch (error) {
    console.error('Error en la ruta /loginc:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Ruta liviana para que el front confirme si el token guardado todavía es válido.
// Si el token venció o es inválido, verificarTokenAdmin responde 403/401
// antes de llegar a este handler.
router.get('/verify', verificarTokenAdmin, (req, res) => {
  return res.status(200).json({ success: true, isAdmin: true });
});

module.exports = router;