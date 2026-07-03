const upload = require("../upload")
const { Router } = require("express");
const getProductos = require("../controllers/producto/getProducto");
const createNewProducto = require("../controllers/producto/newProducto");
const productoId = require("../controllers/producto/getById")
const getCat = require("../controllers/producto/getCategoria")
const actualizarCantidadDisponibleVariante = require("../controllers/producto/patchProducto")
const deleteProduct = require("../controllers/producto/deleteProduct")
const buscar = require("../controllers/producto/searchProducto")
const getCategorias = require("../controllers/producto/getCategoria")
const createCategoria = require("../controllers/producto/createCategoria")
const updateCategoria = require("../controllers/producto/updateCategoria")
const deleteCategoria = require("../controllers/producto/deleteCategoria")
const duplicarProducto = require("../controllers/producto/duplicarProducto")
const getProductosPapelera = require("../controllers/producto/getProductosPapelera")
const restaurarProducto = require("../controllers/producto/restaurarProducto")
const eliminarDefinitivo = require("../controllers/producto/eliminarDefinitivo")
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

router.get("/producto", async (req, res) => {
    try {
        const producto = await getProductos();
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: "erro al obtener el producto" })
    }
})

// El error de Cloudinary (credenciales inválidas, corte de red, cuota
// superada, etc.) ocurre DENTRO del middleware de subida, antes de que
// el try/catch de la ruta llegue a actuar. Sin este envoltorio, ese
// error salta directo al manejador de errores genérico de toda la app
// (ver app.js), que devuelve el mensaje técnico crudo del SDK de
// Cloudinary tal cual — algo como "Server returned unexpected status
// code - 403", que no le dice nada útil al admin sobre qué pasó ni qué
// hacer. Acá lo interceptamos, lo logueamos completo para debug, y
// respondemos con un mensaje claro y accionable.
const subirImagenes = (req, res, next) => {
    upload.any()(req, res, (error) => {
        if (error) {
            console.error("Error al subir imágenes a Cloudinary:", error);

            return res.status(502).json({
                error:
                    "No pudimos subir las imágenes del producto. " +
                    "Puede ser un problema temporal de conexión — probá de nuevo en un minuto. " +
                    "Si el error se repite, avisale al administrador del sistema."
            });
        }

        next();
    });
};

router.post("/nuevoProducto", verificarTokenAdmin, subirImagenes, async (req, res) => {
    try {

        const files = req.files;
        // Acceder a los datos del formulario
        const formData = req.body;

        // Continuar con el procesamiento de los datos del formulario...
        // Llamar a la función que crea un nuevo producto
        const resultado = await createNewProducto(formData, files);

        // Si el resultado es un error, responder con un error
        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        // Si el producto se creó exitosamente, responder con el nuevo producto creado
        return res.status(201).json({ newProducto: resultado.newProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
    }
});




router.get("/ProductoId/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const resultadoId = await productoId(id);
        res.status(200).json(resultadoId)
    } catch (error) {
        res.status(500).json({ error: "error al buscar id" })
    }
})

router.get("/categoria", async (req, res) => {
    try {
        const producto = await getCat();
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: "erro al obtener el producto" })
    }
})

router.patch("/cambio/:id", verificarTokenAdmin, async (req, res) => {
    try {



        await actualizarCantidadDisponibleVariante(req.params.id, req.body.cantidad_disponible); // Pasar solo la nueva cantidad disponible
        res.status(200).json();
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});


router.patch("/editar/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const productoModificado = await actualizarCantidadDisponibleVariante(req, res);
        res.status(200).json({
            message: "Producto modificado exitosamente",
            modifiedProduct: productoModificado
        });
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});


router.delete("/eliminar/:id", verificarTokenAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const eliminar = await deleteProduct(id);
        if (eliminar.error) {
            res.status(404).json({ error: eliminar.message });
        } else {
            res.status(200).json(eliminar);
        }
    } catch (error) {
        console.error("error al intertar eliminar el producto", error);
        res.status(500).json({ error: "error en el servidor" })
    }
})

router.get("/name/:nombre", async (req, res) => {
    const nombre = req.params.nombre;
    try {
        const resultadoNombre = await buscar(nombre);
        res.status(200).json(resultadoNombre);
    } catch (error) {
        res.status(500).json({ error: "error al buscar el nombre" })
    }
})



router.post("/categorias", verificarTokenAdmin, async (req, res) => {
    const { nombre } = req.body;

    const categoria = await createCategoria(nombre);

    res.json(categoria);
});

router.get("/traercategorias", async (req, res) => {

    try {


        const categorias = await getCategorias();


        res.status(200).json(categorias);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener categorías"
        });

    }

});
router.put(
    "/categorias/:id",
    verificarTokenAdmin,
    updateCategoria
);

router.delete(
    "/categorias/:id",
    verificarTokenAdmin,
    deleteCategoria
);


router.post("/duplicar/:id", verificarTokenAdmin, duplicarProducto);

router.get("/papelera", verificarTokenAdmin, async (req, res) => {
    try {
        const productos = await getProductosPapelera();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener la papelera." });
    }
});

router.put("/restaurar/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const producto = await restaurarProducto(req.params.id);
        res.status(200).json(producto);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "No pudimos restaurar el producto." });
    }
});

router.delete("/eliminarDefinitivo/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const resultado = await eliminarDefinitivo(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "No pudimos eliminar el producto." });
    }
});

module.exports = router;