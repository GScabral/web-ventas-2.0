const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const Pedido = sequelize.define("Pedido", {

    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    tipo_entrega: {
      type: DataTypes.ENUM(
        "RETIRO",
        "ENVIO"
      ),
      defaultValue: "RETIRO"
    },
    email_cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telefono: {
      type: DataTypes.STRING,
    },

    provincia: {
      type: DataTypes.STRING,
    },

    ciudad: {
      type: DataTypes.STRING,
    },

    direccion: {
      type: DataTypes.STRING,
    },

    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "pagado",
        "preparando",
        "enviado",
        "entregado",
        "cancelado"
      ),
      defaultValue: "pendiente",
    },

    total_pedido: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    }

  });

  return Pedido;
};