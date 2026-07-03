const { Productos } = require("../../db");

const restaurarProducto = async (id) => {

    const producto = await Productos.findByPk(id);

    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
    }

    producto.archivado = false;
    producto.archivado_en = null;

    await producto.save();

    return producto;
};

module.exports = restaurarProducto;
