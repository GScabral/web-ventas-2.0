const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const sections = sequelize.define("sections", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        section: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'sections', // Nombre de la tabla en la base de datos
        timestamps: false, // Si no utilizas campos de timestamps (created_at, updated_at)
    }
    );
    return sections;
};