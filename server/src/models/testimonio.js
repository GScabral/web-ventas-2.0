const { DataTypes } = require("sequelize");

// Reseñas/testimonios de clientes que el admin carga a mano (no vienen
// de un pedido real ni de un sistema de reviews) para mostrar en la
// sección "testimonios" de la Home, si la activa desde el editor de
// Diseño.
module.exports = (sequelize) => {

    const Testimonio = sequelize.define("Testimonio", {

        id_testimonio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        texto: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // URL de una imagen ya subida, mismo criterio que logo_url en
        // ConfiguracionSitio y imagen en Banner: se pega el link, no
        // hay upload de archivo desde este panel.
        imagen: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        calificacion: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
        },

        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        orden: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

    });

    return Testimonio;
};
