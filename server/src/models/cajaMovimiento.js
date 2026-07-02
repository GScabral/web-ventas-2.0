const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const CajaMovimiento = sequelize.define("CajaMovimiento", {

    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    tipo: {
      type: DataTypes.ENUM("ingreso", "egreso"),
      allowNull: false,
    },

    // Ej: "Venta pedido #12 en efectivo", "Retiro para compra de bolsas",
    // "Vuelto inicial". Texto libre, lo escribe el admin.
    concepto: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    monto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

  }, {
    timestamps: false,
  });

  return CajaMovimiento;
};
