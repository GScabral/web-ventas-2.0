const { LayoutHome } = require("../../db");
const seccionesPorDefecto = require("./seccionesPorDefecto");

// Admin: la usa el editor de Diseño y la vista previa. Si el borrador
// todavía está vacío (nunca se editó nada), arranca como una copia del
// publicado — así el admin ve el estado real actual como punto de
// partida, no una lista vacía.
const getLayoutHomeBorrador = async () => {

    const [layout] = await LayoutHome.findOrCreate({
        where: { id: 1 },
        defaults: {
            secciones_publicado: seccionesPorDefecto(),
            secciones_borrador: seccionesPorDefecto(),
        },
    });

    return {
        secciones: layout.secciones_borrador || layout.secciones_publicado || seccionesPorDefecto(),
        plantilla_activa: layout.plantilla_activa,
    };
};

module.exports = getLayoutHomeBorrador;
