const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Cliente = sequelize.define('Cliente', {
        id_cliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
        },
        apellido: {
            type: DataTypes.STRING(50),
        },
        direccion: {
            type: DataTypes.TEXT,
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'clientes', // Aquí se define el nombre de la tabla
        timestamps: false, // Aquí se desactivan los timestamps
    });

    return Cliente;
};
