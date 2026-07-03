const { Productos, variantesproductos, Categorias } = require("../../db");

const getProductosPapelera = async () => {
    try {

        const productos = await Productos.findAll({
            where: { archivado: true },
            include: [
                { model: variantesproductos },
                { model: Categorias },
            ],
            order: [["archivado_en", "DESC"]],
        });

        return productos.map((producto) => ({
            id: producto.id_producto,
            nombre: producto.nombre_producto,
            descripcion: producto.descripcion,
            precio: producto.precio,
            archivado_en: producto.archivado_en,
            categoria: producto.Categoria
                ? { id: producto.Categoria.id_categoria, nombre: producto.Categoria.nombre }
                : null,
            cantidadVariantes: producto.variantesproductos?.length || 0,
        }));

    } catch (error) {
        console.error("Error al obtener la papelera:", error);
        throw error;
    }
};

module.exports = getProductosPapelera;
