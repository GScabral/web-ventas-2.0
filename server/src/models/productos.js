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
    categoria: {
      type: DataTypes.STRING(50)
    },
    subcategoria:{
      type:DataTypes.STRING(100),
    }
 
    
  });

  return Productos;
};
