const {Router}=require("express")
const getClientes = require("../controllers/cliente/getClientes")
const createNewCliente = require("../controllers/cliente/newCliente")
const inicioSesion = require("../controllers/cliente/INS")
const verificarCorreo=require("../controllers/cliente/checkEmail")
const obtenerInfUsuario=require("../controllers/cliente/getInfoUsuario")
const allClientes=require("../controllers/cliente/getAllClientes")


const router = Router();

router.get("/cliente/:id", async (req, res) => {
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

router.get("/check",async(req,res)=>{
  const {correo} = req.query;

  try{
    const correoExistente=await verificarCorreo(correo);
    if(correoExistente){
      return res.status(200).send('El correo electrónico está en uso');
    }
    return res.status(404).send('El correo electrónico no está en uso');
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta a la base de datos
    console.error('Error al verificar el correo electrónico:', error);
    return res.status(500).send('Error interno del servidor');
  }
})

router.get("/allClientes",async(req,res)=>{
  try{
    const listaC=await allClientes()
    res.status(200).json(listaC)
  }catch{
    res.status(500).json({error:"error al traer todos lo clientes"})
  }
})

router.get("/InfoUsuario", async (req, res) => {
  const { correo, contraseña } = req.body; // Obtener correo y contraseña del cuerpo de la solicitud

  try {
    const { error, user } = await obtenerInfUsuario(correo, contraseña);

    if (error) {
      return res.status(404).json({ error });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error al verificar credenciales del usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});



router.post("/nuevoCliente",async(req,res)=>{
    try{
        const nuevoCliente=await createNewCliente(req.body);
        if(nuevoCliente && nuevoCliente.error){
            res.status(404).json({error:nuevoCliente.message});
        }else{
            res.status(200).json(nuevoCliente);
        }
    }catch(error){
        res.status(500).json({error:"error en el servidor"})
    }
})


router.post("/login", async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      const inisesion = await inicioSesion(correo, contraseña);
  
      if (inisesion && inisesion.token) {
        res.status(200).json(inisesion);
      } else {
        res.status(404).json({ error: inisesion.message || "Credenciales incorrectas" });
      }
    } catch (error) {
      // Capturar el error y enviar una respuesta con más detalle sobre el error
      res.status(500).json({ error: error.message || "Error en el servidor" });
    }
  });

module.exports = router;