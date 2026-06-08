const { Pedido, DetallesPedido } = require("../../db");

const nuevoPedido = async (req, res) => {
  try {

  

    const {
      email,
      envio,
      email_cliente,
      productos,

      tipo_entrega,
      nombre,
      telefono,
      provincia,
      ciudad,
      direccion
    } = req.body;

    const emailCliente =
      email_cliente || email || null;

    const envioObj = envio || {};

    const tipoEntrega =
      tipo_entrega ||
      envioObj.tipoEntrega ||
      envioObj.tipo_entrega ||
      "RETIRO";

    const nombreCliente =
      nombre ||
      envioObj.nombre ||
      null;

    const telefonoCliente =
      telefono ||
      envioObj.telefono ||
      null;

    const provinciaCliente =
      provincia ||
      envioObj.provincia ||
      null;

    const ciudadCliente =
      ciudad ||
      envioObj.ciudad ||
      null;

    const direccionCliente =
      direccion ||
      envioObj.direccion ||
      null;

    if (!emailCliente) {
      return res.status(400).json({
        error: "Falta email_cliente"
      });
    }

    if (!nombreCliente) {
      return res.status(400).json({
        error: "Falta nombre"
      });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({
        error: "No hay productos"
      });
    }

    const totalPedido = productos.reduce(
      (acc, item) => {

        const precio = Number(
          item.precio_unitario ||
          item.precio ||
          0
        );

        const cantidad = Number(
          item.cantidad ||
          item.cantidad_elegida ||
          1
        );

        return acc + precio * cantidad;

      },
      0
    );

    const pedido = await Pedido.create({

      email_cliente: emailCliente,

      nombre: nombreCliente,

      telefono: telefonoCliente,

      provincia: provinciaCliente,

      ciudad: ciudadCliente,

      direccion: direccionCliente,

      tipo_entrega: tipoEntrega,

      total_pedido: totalPedido,

      estado: "pendiente"
    });

    await Promise.all(
      productos.map((producto) => {

        const precio =
          Number(producto.precio_unitario);

        const cantidad =
          Number(producto.cantidad);

        return DetallesPedido.create({

          PedidoIdPedido:
            pedido.id_pedido,

          nombre:
            producto.nombre,

          cantidad,

          precio_unitario:
            precio,

          color:
            producto.color || null,

          talle:
            producto.talle || null,

          total:
            precio * cantidad
        });

      })
    );

    const pedidoCompleto =
      await Pedido.findByPk(
        pedido.id_pedido,
        {
          include: [
            DetallesPedido
          ]
        }
      );

    return res.status(201).json(
      pedidoCompleto
    );

  } catch (error) {

    console.error(
      "ERROR NUEVO PEDIDO:",
      error
    );

    return res.status(500).json({
      error: error.message
    });

  }
};

module.exports = nuevoPedido;