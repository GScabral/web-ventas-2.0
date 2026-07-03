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
    },

    // Snapshot del cupón usado (si hubo). Se guarda el código y el
    // monto descontado tal como quedó aplicado en su momento, para
    // que si el cupón se borra o cambia después, el pedido conserve
    // el registro real de lo que pagó el cliente.
    cupon_codigo: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    descuento_cupon: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    // Evita que un mismo pedido genere el ingreso en caja dos veces
    // (ej. si lo marcan "entregado", después lo pasan a otro estado
    // por error, y lo vuelven a marcar "entregado").
    registrado_en_caja: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }

  });

  return Pedido;
};