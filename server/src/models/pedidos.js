const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

  });

  return Pedido;
};