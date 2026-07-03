const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Productos = sequelize.define('Productos', {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    nombre_producto: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    descripcion: {
      type: DataTypes.TEXT
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    rama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    // Borrado suave: en vez de eliminar directo, el producto se manda
    // a la papelera. archivado_en queda para poder mostrar "hace
    // cuánto se archivó" y para limpiar automáticamente en el futuro
    // si hiciera falta (ej. vaciar papelera después de 30 días).
    archivado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    archivado_en: {
      type: DataTypes.DATE,
      allowNull: true,
    }

  });

  return Productos;
};