const { DataTypes } = require("sequelize");

// Ciudades donde se ofrece envío rápido en moto/cadete (más barato y
// más rápido que el correo tradicional, muy usado en Argentina para
// entregas dentro de la misma ciudad). Mismo patrón que CostoEnvio,
// pero matcheando por ciudad en vez de por provincia.
module.exports = (sequelize) => {

    const ZonaEnvioMoto = sequelize.define("ZonaEnvioMoto", {

        id_zona_moto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        // Se guarda tal cual la escribe el admin, pero la búsqueda al
        // calcular el envío ignora mayúsculas/acentos (ver
        // calcularCostoMoto.js), igual que con provincia en CostoEnvio.
        ciudad: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        costo: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        // Tiempo estimado de entrega en moto/cadete (días hábiles).
        // Suele ser el mismo día o 1 día; opcional. Igual que en
        // CostoEnvio, requiere el SQL de migración porque sync no altera
        // tablas ya existentes.
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

    return ZonaEnvioMoto;
};
