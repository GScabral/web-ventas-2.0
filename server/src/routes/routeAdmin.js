const {Router}=require("express");
require('dotenv').config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const createAdmin = require("../controllers/admin/admin")
const actualizarStock=require("../controllers/admin/patchAdminProduc");
const enviarCorreo = require("../controllers/correo/correo");


const router = Router();

router.post("/NewAdmin", async (req, res) => {
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



  router.patch("/cambioAdmin/:id", async (req, res) => {
    try {
        await actualizarStock(req.params.id, req.body); // Pasar todos los datos del producto
        res.status(200).json();
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});

router.post('/confirmacionPedido', async (req, res) => {
  try {
    const { idPedido, infoPedido, correo } = req.body;

    console.log("📩 Datos recibidos en backend:", { idPedido, infoPedido, correo });

    await enviarCorreo(idPedido, infoPedido, correo);

    res.status(200).send('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('❌ Error al enviar el correo electrónico:', error);

    res.status(500).json({
      message: 'Error al enviar el correo electrónico',
      error: error.message,   // mensaje claro
      code: error.code || null,  // ej: ETIMEDOUT, EAUTENTICACION, etc
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});



router.post('/loginc', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Autenticación exitosa' });
  } else {
    res.status(401).json({ message: 'Autenticación fallida' });
  }
});

module.exports = router;