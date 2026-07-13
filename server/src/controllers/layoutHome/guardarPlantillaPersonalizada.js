const { LayoutHome, ConfiguracionSitio } = require("../../db");
const seccionesPorDefecto = require("./seccionesPorDefecto");

// Genera un id corto y suficientemente único sin sumar una dependencia
// nueva (nada de uuid): timestamp en base36 + unos caracteres random.
const generarId = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Guarda una FOTO completa del estado visual actual (colores, fuente,
// bordes, densidad, fondos, y el array de secciones con su contenido
// tal cual está en el borrador) como una plantilla más, elegible desde
// Diseño → Plantillas junto a las 3 fijas. A diferencia de esas 3, acá
// no hay una "distribución" separada del contenido — es todo el
// borrador actual, tal cual, para poder volver exactamente a este
// estado más adelante.
const guardarPlantillaPersonalizada = async (nombre) => {

    if (!nombre || !nombre.trim()) {
        throw new Error("Ponele un nombre a la plantilla.");
    }

    const [configuracion] = await ConfiguracionSitio.findOrCreate({ where: { id: 1 } });

    const [layout] = await LayoutHome.findOrCreate({
        where: { id: 1 },
        defaults: {
            secciones_publicado: seccionesPorDefecto(),
            secciones_borrador: seccionesPorDefecto(),
        },
    });

    const nuevaPlantilla = {
        id: generarId(),
        nombre: nombre.trim(),
        creado_en: new Date().toISOString(),
        color_primario: configuracion.color_primario,
        color_secundario: configuracion.color_secundario,
        color_acento: configuracion.color_acento,
        fuente: configuracion.fuente,
        radio_bordes: configuracion.radio_bordes,
        densidad: configuracion.densidad,
        color_fondo: configuracion.color_fondo,
        color_fondo_tarjetas: configuracion.color_fondo_tarjetas,
        secciones: layout.secciones_borrador || layout.secciones_publicado || seccionesPorDefecto(),
    };

    const listaActual = layout.plantillas_personalizadas || [];

    layout.plantillas_personalizadas = [...listaActual, nuevaPlantilla];
    await layout.save();

    return layout.plantillas_personalizadas;
};

module.exports = guardarPlantillaPersonalizada;
