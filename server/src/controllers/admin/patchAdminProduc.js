const { variantesproductos, Productos, Categorias, sections } = require('../../db');

// Actualiza un producto completo desde el modal de edición del admin:
// datos generales, categoría (por nombre, ya que el modal permite
// escribirla libre en vez de elegir de una lista), secciones donde se
// muestra el producto, y las variantes (talla/color/stock).
const actualizarStock = async (idProducto, datosProducto) => {

    const producto = await Productos.findByPk(idProducto);

    if (!producto) {
        throw new Error(`Producto con id ${idProducto} no encontrado`);
    }

    // Campos generales. El modelo usa "nombre_producto", no "nombre"
    // (ese era el bug: se estaba escribiendo en una propiedad que no
    // existe en la tabla, así que nunca se guardaba nada).
    if (datosProducto.nombre !== undefined) {
        producto.nombre_producto = datosProducto.nombre;
    }

    if (datosProducto.precio !== undefined) {
        producto.precio = datosProducto.precio;
    }

    if (datosProducto.descripcion !== undefined) {
        producto.descripcion = datosProducto.descripcion;
    }

    // La categoría llega como { id, nombre } desde el modal (el campo de
    // texto edita el nombre directamente). Buscamos la categoría real por
    // ese nombre para obtener el id_categoria; si no existe ninguna con
    // ese nombre exacto, no tocamos categoriaId para no dejar el producto
    // apuntando a una categoría inexistente.
    if (datosProducto.categoria?.nombre) {
        const categoriaEncontrada = await Categorias.findOne({
            where: { nombre: datosProducto.categoria.nombre }
        });

        if (categoriaEncontrada) {
            producto.categoriaId = categoriaEncontrada.id_categoria;
        } else {
            console.warn(
                `Categoría "${datosProducto.categoria.nombre}" no existe; ` +
                `no se modificó la categoría del producto ${idProducto}.`
            );
        }
    }

    await producto.save();

    // Secciones donde se muestra el producto (hero, banner, destacados...).
    // El modal manda un array de objetos { section, title }; hay que
    // resolver cada uno contra la tabla real "sections" (creándola si no
    // existe todavía) y sincronizar la relación completa de una vez.
    if (Array.isArray(datosProducto.sections)) {
        const sectionInstances = await Promise.all(
            datosProducto.sections.map(async (s) => {
                const [instance] = await sections.findOrCreate({
                    where: { section: s.section },
                    defaults: { title: s.title || s.section }
                });
                return instance;
            })
        );

        await producto.setSections(sectionInstances);
    }

    // Variantes: talla, color y stock de cada una.
    if (Array.isArray(datosProducto.variantes)) {
        for (const variante of datosProducto.variantes) {
            const { idVariante, cantidad_disponible, color, talla } = variante;

            if (!idVariante) continue;

            const varianteProducto = await variantesproductos.findByPk(idVariante);

            if (!varianteProducto) {
                console.warn(`Variante con ID ${idVariante} no encontrada`);
                continue;
            }

            varianteProducto.cantidad_disponible = cantidad_disponible;
            varianteProducto.color = color;
            varianteProducto.talla = talla;

            await varianteProducto.save();
        }
    }

    return producto;
};

module.exports = actualizarStock;