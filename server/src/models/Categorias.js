const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Categorias = sequelize.define("Categorias", {

        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        slug: {
            type: DataTypes.STRING(120),
            unique: true
        }

    });

    return Categorias;
};