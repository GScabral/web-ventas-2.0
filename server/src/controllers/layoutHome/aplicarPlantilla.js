const { LayoutHome } = require("../../db");
const actualizarConfiguracion = require("../configuracion/actualizarConfiguracion");
const seccionesPorDefecto = require("./seccionesPorDefecto");

// Una "plantilla" es un combo predefinido de: los 3 colores + 1
// tipografía + bordes/densidad/fondos que ya se pueden editar a mano
// desde Personalización, MÁS una "distribucion" — qué secciones van
// visibles y en qué orden. Lo que una plantilla built-in NUNCA toca es
// el "contenido" de cada sección (textos cargados, fuente de productos
// elegida, testimonios) ni las tablas de Productos/Testimonios — por
// eso aplicar o cambiar de plantilla es reversible y no hace perder
// nada cargado, aunque sí cambia qué se ve y en qué orden.
//
// Los fondos se mantienen claros en las 6 (blanco/gris muy claro): los
// colores de texto (--text-primary, etc.) no son "theme-aware" todavía,
// así que un fondo oscuro dejaría el texto ilegible. Lo que sí cambia
// fuerte entre plantillas son los colores de acento, los bordes y la
// densidad de espaciado.
const PLANTILLAS = {
    minimalista: {
        color_primario: "#111111",
        color_secundario: "#7a7a7a",
        color_acento: "#4b5563",
        fuente: "minimal",
        radio_bordes: "cuadrado",
        densidad: "amplia",
        color_fondo: "#ffffff",
        color_fondo_tarjetas: "#ffffff",
        // Foco 100% en el producto: nada de vidriera ni prueba social.
        distribucion: {
            banner: { visible: true, orden: 0 },
            hero: { visible: false, orden: 1 },
            catalogo: { visible: true, orden: 2 },
            newsletter: { visible: true, orden: 3 },
            destacados: { visible: false, orden: 4 },
            categorias: { visible: false, orden: 5 },
            testimonios: { visible: false, orden: 6 },
        },
    },
    urbano: {
        // Gris cemento claro con negro y amarillo fuerte: industrial,
        // con actitud, pero sobre fondo claro (el texto de los
        // componentes públicos todavía es oscuro fijo, así que un fondo
        // negro los dejaría ilegibles).
        color_primario: "#111111",
        color_secundario: "#eab308",
        color_acento: "#ff3b30",
        fuente: "moderna",
        radio_bordes: "cuadrado",
        densidad: "compacta",
        color_fondo: "#e9e9e6",
        color_fondo_tarjetas: "#ffffff",
        // Directo a los productos que marcan tendencia, después a
        // explorar por categoría. Sin testimonios (no es el tono).
        distribucion: {
            banner: { visible: true, orden: 0 },
            hero: { visible: false, orden: 1 },
            destacados: { visible: true, orden: 2 },
            categorias: { visible: true, orden: 3 },
            catalogo: { visible: true, orden: 4 },
            newsletter: { visible: true, orden: 5 },
            testimonios: { visible: false, orden: 6 },
        },
    },
    elegante: {
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
        fuente: "elegante",
        radio_bordes: "redondeado",
        densidad: "amplia",
        color_fondo: "#faf3ee",
        color_fondo_tarjetas: "#ffffff",
        // Recorrido completo tipo boutique: vidriera, destacados,
        // categorías, catálogo y cierre con testimonios (confianza).
        distribucion: {
            banner: { visible: true, orden: 0 },
            hero: { visible: false, orden: 1 },
            destacados: { visible: true, orden: 2 },
            categorias: { visible: true, orden: 3 },
            catalogo: { visible: true, orden: 4 },
            testimonios: { visible: true, orden: 5 },
            newsletter: { visible: true, orden: 6 },
        },
    },
    impacto: {
        // Celeste hielo con azul eléctrico y rosa: fresco, moderno,
        // tipo landing. Fondo claro para no romper el texto oscuro fijo
        // de los componentes públicos.
        color_primario: "#1d4ed8",
        color_secundario: "#0ea5e9",
        color_acento: "#f43f7e",
        fuente: "moderna",
        radio_bordes: "redondeado",
        densidad: "compacta",
        color_fondo: "#eaf2fb",
        color_fondo_tarjetas: "#ffffff",
        // Landing directa: hero grande con CTA de entrada (no banner
        // chico), directo a destacados y catálogo. Sin categorías ni
        // testimonios — pensada para entrar rápido a comprar.
        distribucion: {
            hero: { visible: true, orden: 0 },
            destacados: { visible: true, orden: 1 },
            catalogo: { visible: true, orden: 2 },
            newsletter: { visible: true, orden: 3 },
            banner: { visible: false, orden: 4 },
            categorias: { visible: false, orden: 5 },
            testimonios: { visible: false, orden: 6 },
        },
    },
    editorial: {
        // Beige tipo revista, cálido y claro, tipografía serif.
        color_primario: "#7a5b3a",
        color_secundario: "#8a8b5e",
        color_acento: "#c2703d",
        fuente: "clasica",
        radio_bordes: "redondeado",
        densidad: "amplia",
        color_fondo: "#efe7d9",
        color_fondo_tarjetas: "#ffffff",
        // Sin banner ni hero promocional: arranca directo por
        // categorías (navegar antes que "vender"), suma destacados y
        // testimonios como curaduría/confianza antes del catálogo.
        distribucion: {
            categorias: { visible: true, orden: 0 },
            destacados: { visible: true, orden: 1 },
            testimonios: { visible: true, orden: 2 },
            catalogo: { visible: true, orden: 3 },
            newsletter: { visible: true, orden: 4 },
            banner: { visible: false, orden: 5 },
            hero: { visible: false, orden: 6 },
        },
    },
    outlet: {
        // Claro pero enérgico: violeta fuerte + lila en las tarjetas.
        color_primario: "#6d28d9",
        color_secundario: "#ec4899",
        color_acento: "#7c3aed",
        fuente: "minimal",
        radio_bordes: "cuadrado",
        densidad: "compacta",
        color_fondo: "#f5f0ff",
        color_fondo_tarjetas: "#ffffff",
        // La más corta de todas a propósito: banner de oferta y directo
        // al catálogo, sin destacados/categorías/testimonios/newsletter
        // — cero fricción entre entrar y comprar.
        distribucion: {
            banner: { visible: true, orden: 0 },
            catalogo: { visible: true, orden: 1 },
            hero: { visible: false, orden: 2 },
            destacados: { visible: false, orden: 3 },
            categorias: { visible: false, orden: 4 },
            testimonios: { visible: false, orden: 5 },
            newsletter: { visible: false, orden: 6 },
        },
    },
};

// Toma las secciones actuales (con su contenido tal cual está cargado)
// y les pisa solo "visible"/"orden" según un mapa {tipo: {visible, orden}}.
// Compartido entre las 6 plantillas built-in — cada una define su propio
// mapa de distribución, pero el merge es el mismo.
const fusionarDistribucion = (seccionesBase, distribucion) =>
    seccionesBase.map(seccion => {
        const ajuste = distribucion[seccion.tipo];
        if (!ajuste) return seccion;
        return { ...seccion, visible: ajuste.visible, orden: ajuste.orden };
    });

const aplicarPlantilla = async (nombrePlantilla) => {

    const [layout] = await LayoutHome.findOrCreate({
        where: { id: 1 },
        defaults: {
            secciones_publicado: seccionesPorDefecto(),
            secciones_borrador: seccionesPorDefecto(),
        },
    });

    const base = layout.secciones_borrador || layout.secciones_publicado || seccionesPorDefecto();

    const builtIn = PLANTILLAS[nombrePlantilla];

    let datosEstilo;
    let seccionesNuevas;
    let idPlantillaActiva;

    if (builtIn) {

        datosEstilo = {
            color_primario: builtIn.color_primario,
            color_secundario: builtIn.color_secundario,
            color_acento: builtIn.color_acento,
            fuente: builtIn.fuente,
            radio_bordes: builtIn.radio_bordes,
            densidad: builtIn.densidad,
            color_fondo: builtIn.color_fondo,
            color_fondo_tarjetas: builtIn.color_fondo_tarjetas,
        };

        seccionesNuevas = fusionarDistribucion(base, builtIn.distribucion);
        idPlantillaActiva = nombrePlantilla;

    } else {

        // No es una de las 3 fijas: buscamos entre las plantillas que el
        // propio admin guardó ("Guardar combinación actual como plantilla").
        const personalizada = (layout.plantillas_personalizadas || [])
            .find(p => p.id === nombrePlantilla);

        if (!personalizada) {
            throw new Error(`La plantilla "${nombrePlantilla}" no existe.`);
        }

        datosEstilo = {
            color_primario: personalizada.color_primario,
            color_secundario: personalizada.color_secundario,
            color_acento: personalizada.color_acento,
            fuente: personalizada.fuente,
            radio_bordes: personalizada.radio_bordes,
            densidad: personalizada.densidad,
            color_fondo: personalizada.color_fondo,
            color_fondo_tarjetas: personalizada.color_fondo_tarjetas,
        };

        // A diferencia de las built-in, una plantilla personalizada es
        // una foto completa (incluye contenido): se reemplazan las
        // secciones enteras, no solo visible/orden.
        seccionesNuevas = personalizada.secciones || base;
        idPlantillaActiva = personalizada.id;
    }

    // Reutiliza el mismo validador/actualizador que ya usa Personalización
    // a mano — así un color o valor mal armado nunca puede romper el CSS.
    const configuracion = await actualizarConfiguracion(datosEstilo);

    // Igual que los colores, la plantilla se aplica al toque: se guarda
    // en borrador y en publicado a la vez, para que el editor y el sitio
    // real no queden desalineados. Si el admin ya había reordenado
    // secciones a mano sin pasar por una plantilla, eso se pisa acá (es
    // lo esperado: elegir una plantilla define una distribución de
    // punta a punta).
    layout.secciones_borrador = seccionesNuevas;
    layout.secciones_publicado = seccionesNuevas;
    layout.plantilla_activa = idPlantillaActiva;
    await layout.save();

    return {
        configuracion,
        plantilla_activa: idPlantillaActiva,
        secciones: seccionesNuevas,
    };
};

module.exports = aplicarPlantilla;
module.exports.PLANTILLAS = PLANTILLAS;
