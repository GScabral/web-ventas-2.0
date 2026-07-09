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
    },

    // Costo de envío aplicado en el momento de la compra (según la
    // provincia). Se guarda el valor real cobrado, no una referencia
    // a la tabla de costos — así, si el admin cambia el precio del
    // envío después, los pedidos viejos no cambian retroactivamente.
    costo_envio: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    // Cómo se va a pagar (o pagó) este pedido. "whatsapp" es el
    // camino original: se coordina el pago a mano fuera del sitio.
    // "mercadopago" es el pago online — en ese caso el estado pasa a
    // "pagado" solo cuando llega la confirmación real por webhook
    // (ver controllers/mp/webhook.js), nunca antes.
    metodo_pago: {
      type: DataTypes.ENUM("whatsapp", "mercadopago"),
      defaultValue: "whatsapp",
    },

    // Id de la Preference de Mercado Pago generada para este pedido.
    // Sirve para volver a buscar/regenerar el checkout si el cliente
    // vuelve atrás sin pagar.
    mp_preference_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Id del Payment real ya confirmado por Mercado Pago (no de la
    // preference). Se completa recién cuando el webhook verificó el
    // pago contra la API de MP — nunca se confía en un dato que
    // mande el navegador.
    mp_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  });

  return Pedido;
};