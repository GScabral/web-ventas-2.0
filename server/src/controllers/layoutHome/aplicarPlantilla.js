const { LayoutHome } = require("../../db");
const actualizarConfiguracion = require("../configuracion/actualizarConfiguracion");
const seccionesPorDefecto = require("./seccionesPorDefecto");

// Una "plantilla" es un combo predefinido de: los 3 colores + 1
// tipografía que ya se pueden editar a mano desde Personalización, MÁS
// una "distribucion" — qué secciones van visibles y en qué orden. Lo
// que una plantilla NUNCA toca es el "contenido" de cada sección
// (textos cargados, fuente de productos elegida, testimonios) ni las
// tablas de Productos/Testimonios — por eso aplicar o cambiar de
// plantilla es reversible y no hace perder nada cargado, aunque sí
// cambia qué se ve y en qué orden (que es justo el objetivo).
const PLANTILLAS = {
    minimalista: {
        color_primario: "#111111",
        color_secundario: "#7a7a7a",
        color_acento: "#4b5563",
        fuente: "minimal",
        // Foco 100% en el producto: nada de vidriera ni prueba social.
        distribucion: {
            banner: { visible: true, orden: 0 },
            catalogo: { visible: true, orden: 1 },
            newsletter: { visible: true, orden: 2 },
            destacados: { visible: false, orden: 3 },
            categorias: { visible: false, orden: 4 },
            testimonios: { visible: false, orden: 5 },
        },
    },
    urbano: {
        color_primario: "#0a0a0a",
        color_secundario: "#eab308",
        color_acento: "#ff3b30",
        fuente: "moderna",
        // Directo a los productos que marcan tendencia, después a
        // explorar por categoría. Sin testimonios (no es el tono).
        distribucion: {
            banner: { visible: true, orden: 0 },
            destacados: { visible: true, orden: 1 },
            categorias: { visible: true, orden: 2 },
            catalogo: { visible: true, orden: 3 },
            newsletter: { visible: true, orden: 4 },
            testimonios: { visible: false, orden: 5 },
        },
    },
    elegante: {
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
        fuente: "elegante",
        // Recorrido completo tipo boutique: vidriera, destacados,
        // categorías, catálogo y cierre con testimonios (confianza).
        distribucion: {
            banner: { visible: true, orden: 0 },
            destacados: { visible: true, orden: 1 },
            categorias: { visible: true, orden: 2 },
            catalogo: { visible: true, orden: 3 },
            testimonios: { visible: true, orden: 4 },
            newsletter: { visible: true, orden: 5 },
        },
    },
};

const aplicarPlantilla = async (nombrePlantilla) => {

    const plantilla = PLANTILLAS[nombrePlantilla];

    if (!plantilla) {
        throw new Error(`La plantilla "${nombrePlantilla}" no existe.`);
    }

    // Reutiliza el mismo validador/actualizador que ya usa Personalización
    // a mano — así un color mal armado nunca puede llegar a romper el CSS.
    const configuracion = await actualizarConfiguracion({
        color_primario: plantilla.color_primario,
        color_secundario: plantilla.color_secundario,
        color_acento: plantilla.color_acento,
        fuente: plantilla.fuente,
    });

    const [layout] = await LayoutHome.findOrCreate({
        where: { id: 1 },
        defaults: {
            secciones_publicado: seccionesPorDefecto(),
            secciones_borrador: seccionesPorDefecto(),
        },
    });

    // Partimos de las secciones actuales (con el contenido que el admin
    // ya haya cargado) y les pisamos solo "visible"/"orden" según la
    // distribución de la plantilla — el resto de cada sección
    // (contenido.titulo, contenido.seccionSlug, etc.) queda intacto.
    const base = layout.secciones_borrador || layout.secciones_publicado || seccionesPorDefecto();

    const seccionesConDistribucion = base.map(seccion => {
        const ajuste = plantilla.distribucion[seccion.tipo];
        if (!ajuste) return seccion;
        return { ...seccion, visible: ajuste.visible, orden: ajuste.orden };
    });

    // Igual que los colores, la distribución de la plantilla se aplica
    // al toque: se guarda en borrador y en publicado a la vez, para que
    // el editor y el sitio real no queden desalineados. Si el admin ya
    // había reordenado secciones a mano sin aplicar una plantilla
    // nueva, esa reordenación manual se pisa (es lo esperado: elegir
    // una plantilla define una distribución de punta a punta).
    layout.secciones_borrador = seccionesConDistribucion;
    layout.secciones_publicado = seccionesConDistribucion;
    layout.plantilla_activa = nombrePlantilla;
    await layout.save();

    return {
        configuracion,
        plantilla_activa: nombrePlantilla,
        secciones: seccionesConDistribucion,
    };
};

module.exports = aplicarPlantilla;
module.exports.PLANTILLAS = PLANTILLAS;
