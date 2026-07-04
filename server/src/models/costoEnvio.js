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

        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    });

    return CostoEnvio;
};
