const { Productos } = require('../../db');

// "Eliminar" ahora es un borrado suave: el producto se manda a la
// papelera (archivado = true) en vez de borrarse de la base. Sigue
// existiendo por si lo eliminaron por error, y se puede restaurar
// desde /admin/papelera. El borrado definitivo real es una acción
// aparte (ver eliminarDefinitivo.js).
const deleteProduct = async (id) => {
    try {
        const productDelete = await Productos.findByPk(id)

        if (!productDelete) {
            throw new Error("id no encontrado")
        }

        productDelete.archivado = true;
        productDelete.archivado_en = new Date();

        await productDelete.save();

        return ("producto archivado")

    } catch (error) {
        console.error("error al intentar archivar el producto", error)
        throw error;
    }
}

module.exports = deleteProduct;
