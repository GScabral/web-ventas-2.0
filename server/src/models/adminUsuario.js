const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        id_admin: {
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
        contraseña: {
            type: DataTypes.STRING, // Tipo string para almacenar la contraseña
            allowNull: false, // No permitir contraseñas nulas
        },
        // Otros atributos específicos del admin
        permisos: {
            type: DataTypes.JSONB, // Por ejemplo, podrías almacenar permisos como un objeto JSON
        },
    }, {
        tableName: 'admins',
        timestamps: false,
    });

    return Admin;
};