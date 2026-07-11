const { LayoutHome } = require("../../db");
const actualizarConfiguracion = require("../configuracion/actualizarConfiguracion");

// Una "plantilla" acá es, en los hechos, un combo predefinido de los
// mismos 3 colores + 1 tipografía que ya se pueden editar a mano desde
// Personalización — no reemplaza componentes ni reacomoda el layout,
// así que nunca toca secciones_borrador/secciones_publicado. Por eso
// es 100% reversible: volver a la plantilla anterior es solo aplicar
// sus valores de vuelta.
const PLANTILLAS = {
    minimalista: {
        color_primario: "#111111",
        color_secundario: "#7a7a7a",
        color_acento: "#4b5563",
        fuente: "minimal",
    },
    urbano: {
        color_primario: "#0a0a0a",
        color_secundario: "#eab308",
        color_acento: "#ff3b30",
        fuente: "moderna",
    },
    elegante: {
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
        fuente: "elegante",
    },
};

const aplicarPlantilla = async (nombrePlantilla) => {

    const plantilla = PLANTILLAS[nombrePlantilla];

    if (!plantilla) {
        throw new Error(`La plantilla "${nombrePlantilla}" no existe.`);
    }

    // Reutiliza el mismo validador/actualizador que ya usa Personalización
    // a mano — así un color mal armado nunca puede llegar a romper el CSS.
    const configuracion = await actualizarConfiguracion(plantilla);

    const [layout] = await LayoutHome.findOrCreate({ where: { id: 1 } });
    layout.plantilla_activa = nombrePlantilla;
    await layout.save();

    return { configuracion, plantilla_activa: nombrePlantilla };
};

module.exports = aplicarPlantilla;
module.exports.PLANTILLAS = PLANTILLAS;
