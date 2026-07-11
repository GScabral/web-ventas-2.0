const { LayoutHome } = require("../../db");

// Copia borrador -> publicado en un solo paso. A partir de acá el
// sitio en vivo ya muestra los cambios, sin redeploy — es una simple
// lectura de fila distinta la próxima vez que el Home público pida
// getLayoutHomePublicado.
const publicarLayoutHome = async () => {

    const [layout] = await LayoutHome.findOrCreate({ where: { id: 1 } });

    if (!layout.secciones_borrador) {
        throw new Error("No hay ningún borrador cargado todavía para publicar.");
    }

    layout.secciones_publicado = layout.secciones_borrador;
    await layout.save();

    return { secciones: layout.secciones_publicado };
};

module.exports = publicarLayoutHome;
