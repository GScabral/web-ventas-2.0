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
        // Recuperación de contraseña: al pedir un reset se guarda acá un
        // token aleatorio (hasheado, nunca el token en crudo) y su fecha
        // de vencimiento. Se limpian al usarse o al vencer. NOTA: como el
        // arranque usa sync({ force:false }) (no altera tablas ya
        // creadas), estas dos columnas hay que agregarlas a mano en la
        // base con el SQL de migración incluido en el repo.
        reset_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reset_token_expira: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'clientes', // Aquí se define el nombre de la tabla
        timestamps: false, // Aquí se desactivan los timestamps
    });

    return Cliente;
};
