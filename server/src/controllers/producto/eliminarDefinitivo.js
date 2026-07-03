const { Productos } = require("../../db");

// Este SÍ borra de verdad — solo se puede llamar sobre un producto
// que ya está en la papelera (archivado = true), como capa extra de
// seguridad: no se puede borrar definitivo un producto activo sin
// haberlo mandado antes a la papelera.
const eliminarDefinitivo = async (id) => {

    const producto = await Productos.findByPk(id);

    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
    }

    if (!producto.archivado) {
        const error = new Error("Este producto no está en la papelera. Archivalo primero.");
        error.status = 400;
        throw error;
    }

    await producto.destroy();

    return { mensaje: "Producto eliminado definitivamente." };
};

module.exports = eliminarDefinitivo;
