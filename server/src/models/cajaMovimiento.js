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

    // Con qué se cobró/pagó este movimiento. Útil sobre todo para
    // separar ventas en efectivo (que sí afectan lo que hay en el
    // cajón físico) de las que se cobraron por transferencia o MP
    // (que no deberían sumarse al conteo de efectivo, aunque sí sean
    // parte de las ventas del día).
    metodo_pago: {
      type: DataTypes.ENUM(
        "efectivo",
        "transferencia",
        "tarjeta_debito",
        "tarjeta_credito",
        "mercado_pago",
        "otro"
      ),
      allowNull: false,
      defaultValue: "efectivo",
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
