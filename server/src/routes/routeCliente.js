const {Router}=require("express")
const rateLimit = require("express-rate-limit");
const getClientes = require("../controllers/cliente/getClientes")
const createNewCliente = require("../controllers/cliente/newCliente")
const { validarRegistroCliente } = require("../validacion");
const { validationResult } = require('express-validator');
const inicioSesion = require("../controllers/cliente/INS")
const allClientes=require("../controllers/cliente/getAllClientes")
const solicitarReset = require("../controllers/cliente/solicitarReset")
const resetearContrasena = require("../controllers/cliente/resetearContrasena")
const { verificarTokenAdmin } = require("../middleware/auth");


const router = Router();

// Mismo criterio que el rate-limiter del login de admin (ver
// routeAdmin.js): sin esto, nada frena a alguien probando contraseñas
// en bucle contra la cuenta de un cliente, o creando cuentas en masa.
const clienteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos. Probá de nuevo en 15 minutos."
  },
});

// Protegida: solo el admin puede consultar los datos de un cliente por id.
// No hay sesión de cliente real (basada en JWT propio) todavía, así que no
// podemos validar "este es tu propio perfil"; por ahora, gestión de
// clientes = tarea de admin.
router.get("/cliente/:id", verificarTokenAdmin, async (req, res) => {
  const { id } = req.params; // Captura el parámetro ID de la URL

  try {
    const cliente = await getClientes(id); // Llama a la función para obtener el cliente por ID

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
});

// Protegida: lista completa de clientes, solo para el panel de admin.
router.get("/allClientes", verificarTokenAdmin, async(req,res)=>{
  try{
    const listaC=await allClientes()
    res.status(200).json(listaC)
  }catch{
    res.status(500).json({error:"error al traer todos lo clientes"})
  }
})

router.post("/nuevoCliente", clienteLimiter, validarRegistroCliente, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const nuevoCliente = await createNewCliente(req.body);
    if (nuevoCliente && nuevoCliente.error) {
      // Antes decía "nuevoCliente.message", pero createNewCliente
      // devuelve { error: "..." } en la rama de error, no .message —
      // el mensaje real nunca llegaba al front (undefined).
      res.status(400).json({ error: nuevoCliente.error });
    } else {
      res.status(200).json(nuevoCliente);
    }
  } catch (error) {
    res.status(500).json({ error: "error en el servidor" })
  }
});


// Recuperación de contraseña (dos pasos). Ambas con el mismo rate
// limiter que login/registro, para que nadie las use en bucle (spam de
// mails de reset, o prueba de tokens por fuerza bruta).
router.post("/solicitar-reset", clienteLimiter, solicitarReset);
router.post("/resetear-contrasena", clienteLimiter, resetearContrasena);

router.post("/login", clienteLimiter, async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      const inisesion = await inicioSesion(correo, contraseña);
  
      if (inisesion && inisesion.token) {
        res.status(200).json(inisesion);
      } else {
        // inicioSesion devuelve { error: "..." }, no .message — igual
        // que en /nuevoCliente, el mensaje real nunca llegaba al front.
        res.status(401).json({ error: inisesion.error || "Credenciales incorrectas" });
      }
    } catch (error) {
      // Capturar el error y enviar una respuesta con más detalle sobre el error
      res.status(500).json({ error: error.message || "Error en el servidor" });
    }
  });

module.exports = router;