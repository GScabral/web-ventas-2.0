const { LayoutHome } = require("../../db");

// Borra una plantilla personalizada por id. No toca nada más: si esa
// plantilla estaba activa en este momento, el sitio sigue mostrando lo
// que ya tenía aplicado (colores/secciones ya guardados en
// ConfiguracionSitio/LayoutHome) — borrar la plantilla de la lista no
// "deshace" haberla aplicado antes.
const eliminarPlantillaPersonalizada = async (id) => {

    const layout = await LayoutHome.findOne({ where: { id: 1 } });

    if (!layout) {
        throw new Error("No encontramos el diseño de la home.");
    }

    const listaActual = layout.plantillas_personalizadas || [];
    const existe = listaActual.some(p => p.id === id);

    if (!existe) {
        throw new Error("No encontramos esa plantilla.");
    }

    layout.plantillas_personalizadas = listaActual.filter(p => p.id !== id);
    await layout.save();

    return layout.plantillas_personalizadas;
};

module.exports = eliminarPlantillaPersonalizada;
