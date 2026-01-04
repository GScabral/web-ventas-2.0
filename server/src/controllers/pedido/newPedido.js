const { Pedido, DetallesPedido } = require('../../db');


const crearPedido = async (pedidoData) => {
  let transaction;

  try {
    transaction = await Pedido.sequelize.transaction();

    const { email_cliente, productos } = pedidoData;

    if (!email_cliente) throw new Error("No se recibió email_cliente");
    if (!productos || !Array.isArray(productos)) throw new Error("productos debe ser un array");

    const nuevoPedido = await Pedido.create(
      {
        email_cliente,
        estado_pedido: "PENDIENTE"
      },
      { transaction }
    );

    const { id_pedido } = nuevoPedido;
    for (const producto of pedidoData.productos) {
      const detallePedido = {
        PedidoIdPedido: id_pedido,
        nombre: producto.nombre,
        ProductoIdProducto: producto.id,
        cantidad: producto.cantidad,
        color: producto.color, // Suponiendo que la variante es un objeto con un color
        talle: producto.talla, // Suponiendo que la variante es un objeto con un talla
        total: producto.total,
      };

      // Agregar un console.log para ver los detalles del pedido antes de crearlos
      console.log("Detalle del pedido a crear:", detallePedido);

      await DetallesPedido.create(detallePedido, { transaction });
    }

    // Commit de la transacción
    await transaction.commit();
    

    return {
      success: true,
      message: "Pedido creado correctamente",
      id_pedido
    };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("❌ Error al crear pedido:", error);
    return { success: false, error: error.message };
  }
};


module.exports = crearPedido