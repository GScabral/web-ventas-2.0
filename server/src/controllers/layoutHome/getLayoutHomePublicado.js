const { LayoutHome } = require("../../db");
const seccionesPorDefecto = require("./seccionesPorDefecto");

// Pública: la lee el Home real de la tienda. Si todavía no se guardó
// nunca nada (instalación nueva, o recién deployada esta feature), se
// devuelve el layout por defecto — que reproduce el Home de siempre —
// sin necesidad de haber corrido ningún seed a mano.
const getLayoutHomePublicado = async () => {

    const [layout] = await LayoutHome.findOrCreate({
        where: { id: 1 },
        defaults: {
            secciones_publicado: seccionesPorDefecto(),
            secciones_borrador: seccionesPorDefecto(),
        },
    });

    return {
        secciones: layout.secciones_publicado || seccionesPorDefecto(),
        plantilla_activa: layout.plantilla_activa,
    };
};

module.exports = getLayoutHomePublicado;
