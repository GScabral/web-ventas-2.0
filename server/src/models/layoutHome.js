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
        plantilla_activa: {
            type: DataTypes.STRING(30),
            defaultValue: "elegante",
        },

    });

    return LayoutHome;
};
