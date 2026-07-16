const { DataTypes } = require("sequelize");

// Reseña real de un comprador sobre un producto (a diferencia de
// Testimonio, que lo carga el admin a mano para la Home). Se muestra en
// la ficha del producto. Como el arranque usa sync({ force:false }),
// esta tabla NUEVA se crea sola la primera vez que levanta el server —
// no hace falta SQL manual para ella (sí para columnas agregadas a
// tablas ya existentes, como las de reset de contraseña).
module.exports = (sequelize) => {

    const Resena = sequelize.define("Resena", {

        id_resena: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        // Nombre que el comprador pone en la reseña (no requiere cuenta).
        nombre: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },

        calificacion: {
            type: DataTypes.INTEGER, // 1 a 5 estrellas
            allowNull: false,
            validate: { min: 1, max: 5 },
        },

        comentario: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // Moderación: las reseñas se publican al instante (aprobado:true),
        // pero el admin puede ocultarlas (aprobado:false) o borrarlas
        // desde el panel. Sirve para bajar spam o comentarios ofensivos
        // sin perder la reseña.
        aprobado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    }, {
        tableName: "resenas",
        timestamps: true, // createdAt sirve para ordenar de más nueva a más vieja
    });

    return Resena;
};
