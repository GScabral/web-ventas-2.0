const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DetallesPedido = sequelize.define(
    "DetallesPedido",
    {
      id_detalle_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      PedidoIdPedido: {
        type: DataTypes.INTEGER,
      },

      id_variante: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      nombre: {
        type: DataTypes.STRING,
      },

      cantidad: {
        type: DataTypes.INTEGER,
      },

      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
      },

      color: {
        type: DataTypes.STRING,
      },

      talle: {
        type: DataTypes.STRING,
      },

      total: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      }
    },
    {
      tableName: "detalles_pedido",
      timestamps: false,
    }
  );

  return DetallesPedido;
};