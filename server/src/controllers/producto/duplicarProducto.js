const { Productos, variantesproductos } = require("../../db");

// Clona un producto completo: mismos datos base (nombre, descripción,
// precio, categoría) y todas sus variantes (color, talla, stock,
// imágenes). Pensado para cuando hay que cargar varios productos muy
// parecidos entre sí (mismos talles/colores, precio similar) y no
// tiene sentido escribir todo de cero cada vez.
//
// El nombre del duplicado lleva "(copia)" para que quede claro cuál es
// cuál en el listado — el admin puede editarlo después desde la
// pantalla de edición, como cualquier otro producto.
const duplicarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const original = await Productos.findByPk(id, {
            include: [variantesproductos],
        });

        if (!original) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        const nuevoProducto = await Productos.create({
            nombre_producto: `${original.nombre_producto} (copia)`,
            descripcion: original.descripcion,
            precio: original.precio,
            rama: original.rama,
            categoriaId: original.categoriaId,
        });

        const variantesOriginales = original.variantesproductos || [];

        await Promise.all(
            variantesOriginales.map((variante) =>
                variantesproductos.create({
                    talla: variante.talla,
                    color: variante.color,
                    cantidad_disponible: variante.cantidad_disponible,
                    imagenes: variante.imagenes,
                    ProductoIdProducto: nuevoProducto.id_producto,
                })
            )
        );

        const productoCompleto = await Productos.findByPk(
            nuevoProducto.id_producto,
            { include: [variantesproductos] }
        );

        res.status(201).json(productoCompleto);

    } catch (error) {
        console.error("Error al duplicar producto:", error);
        res.status(500).json({ error: "No pudimos duplicar el producto." });
    }
};

module.exports = duplicarProducto;
