const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const CostoEnvio = sequelize.define("CostoEnvio", {

        id_costo_envio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        // Se guarda tal cual la escribe el admin, pero la búsqueda al
        // calcular el envío ignora mayúsculas/acentos (ver
        // calcularCostoEnvio.js) para no fallar por "Corrientes" vs
        // "corrientes" vs "CORRIENTES".
        provincia: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        costo: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        // Tiempo estimado de entrega para esta provincia (días hábiles).
        // Opcional: si están cargados, el checkout muestra "llega en X-Y
        // días". Como el arranque usa sync({ force:false }) (no altera
        // tablas existentes), estas dos columnas hay que agregarlas a
        // mano en la base con el SQL de migración incluido en el repo.
        dias_min: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        dias_max: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    });

    return CostoEnvio;
};
