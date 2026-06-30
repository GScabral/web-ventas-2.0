const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Banner = sequelize.define('Banner', {
        id_banner: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: DataTypes.ENUM('main', 'side'),
            allowNull: false,
            defaultValue: 'main',
        },
        eyebrow: {
            type: DataTypes.STRING(60),
        },
        titulo: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        textoBoton: {
            type: DataTypes.STRING(40),
            defaultValue: 'Ver más',
        },
        link: {
            type: DataTypes.STRING(200),
            defaultValue: '/catalogo',
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        orden: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        inicio: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: false,
        tableName: 'banners',
    });

    return Banner;
};
