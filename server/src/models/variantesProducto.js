const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const variantesproductos = sequelize.define('variantesproductos', {
        id_variante: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        talla: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING(122)
        },
        cantidad_disponible: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imagenes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
          },
    }, {
        timestamps: false
    });

    return variantesproductos;
};