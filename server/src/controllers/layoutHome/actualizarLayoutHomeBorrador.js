const { LayoutHome } = require("../../db");

const TIPOS_VALIDOS = [
    "banner",
    "destacados",
    "categorias",
    "catalogo",
    "testimonios",
    "newsletter",
];

// Guarda el borrador tal cual lo arma el editor (orden, visibilidad,
// contenido por sección). No toca secciones_publicado — el sitio en
// vivo no cambia hasta que el admin aprieta "Publicar" en un paso
// aparte (ver publicarLayoutHome.js).
const actualizarLayoutHomeBorrador = async (secciones) => {

    if (!Array.isArray(secciones) || secciones.length === 0) {
        throw new Error("El layout tiene que ser una lista de secciones.");
    }

    for (const seccion of secciones) {
        if (!TIPOS_VALIDOS.includes(seccion.tipo)) {
            throw new Error(`Tipo de sección desconocido: "${seccion.tipo}".`);
        }
    }

    const [layout] = await LayoutHome.findOrCreate({ where: { id: 1 } });

    layout.secciones_borrador = secciones;
    await layout.save();

    return { secciones: layout.secciones_borrador };
};

module.exports = actualizarLayoutHomeBorrador;
