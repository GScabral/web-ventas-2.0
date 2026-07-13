const { DataTypes } = require("sequelize");

// Tabla de una sola fila (mismo patrón que ConfiguracionSitio) que
// guarda cómo está armada la Home: qué secciones se muestran, en qué
// orden, y con qué contenido. Se separa en dos columnas — borrador y
// publicado — para que el admin pueda editar y previsualizar sin que
// el sitio en vivo cambie hasta que apriete "Publicar".
//
// Cada elemento del array JSON tiene la forma:
//   { tipo: "banner"|"destacados"|"categorias"|"testimonios"|"newsletter",
//     visible: true/false,
//     orden: 0, 1, 2...,
//     contenido: {...} }  // shape distinto según el tipo
//
// Como es una tabla nueva, se crea sola la primera vez que arranca el
// servidor (conn.sync({force:false}) crea tablas que faltan, aunque
// NO altera las que ya existen).
module.exports = (sequelize) => {

    const LayoutHome = sequelize.define("LayoutHome", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        secciones_borrador: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        secciones_publicado: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // Solo informativo (para mostrar "Plantilla actual: Urbano" en
        // el admin) — la plantilla en sí no se "guarda" como objeto acá,
        // aplica sus colores/tipografía directo sobre ConfiguracionSitio.
        // Para una plantilla personalizada (ver plantillas_personalizadas),
        // este campo guarda su id en vez de una de las 3 claves fijas.
        plantilla_activa: {
            type: DataTypes.STRING(30),
            defaultValue: "elegante",
        },

        // Plantillas que el propio admin guardó ("Guardar combinación
        // actual como plantilla" en Diseño → Plantillas). A diferencia
        // de las 3 fijas (que solo fusionan visible/orden sin tocar
        // contenido), cada entrada acá es una FOTO completa: colores,
        // fuente, bordes, densidad, fondos y el array de secciones
        // completo (con su contenido) tal como estaba al guardarla.
        //   [{ id, nombre, creado_en,
        //      color_primario, color_secundario, color_acento, fuente,
        //      radio_bordes, densidad, color_fondo, color_fondo_tarjetas,
        //      secciones: [...] }]
        plantillas_personalizadas: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },

    });

    return LayoutHome;
};
