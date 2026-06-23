const { Pedido, DetallesPedido, Productos, oferta } = require("../../db");
const { Op } = require("sequelize");

// Busca el precio real de un producto en la base de datos, aplicando
// el descuento de una oferta activa si corresponde. Nunca confía en el
// precio que manda el cliente desde el navegador.
const obtenerPrecioReal = async (idProducto) => {
  const producto = await Productos.findByPk(idProducto);

  if (!producto) {
    return null;
  }

  let precio = Number(producto.precio);

  const ahora = new Date();

  const ofertaActiva = await oferta.findOne({
    where: {
      producto_id: idProducto,
      inicio: { [Op.lte]: ahora },
      fin: { [Op.gte]: ahora },
    },
  });

  if (ofertaActiva) {
    const descuento = Number(ofertaActiva.descuento) || 0;
    precio = precio - (precio * descuento) / 100;
  }

  return { precio, nombre: producto.nombre_producto };
};

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

    // Verificamos cada producto contra la base de datos: el precio NUNCA
    // se toma del body, siempre se recalcula desde lo que hay en Productos
    // (y la oferta activa, si existe). Esto evita que alguien manipule el
    // precio desde el navegador antes de enviar el pedido.
    const productosVerificados = [];

    for (const item of productos) {
      const idProducto = item.id || item.id_producto;

      if (!idProducto) {
        return res.status(400).json({
          error: `Falta el id del producto "${item.nombre || ""}"`
        });
      }

      const infoReal = await obtenerPrecioReal(idProducto);

      if (!infoReal) {
        return res.status(400).json({
          error: `Producto con id ${idProducto} no encontrado`
        });
      }

      const cantidad = Number(
        item.cantidad ||
        item.cantidad_elegida ||
        1
      );

      productosVerificados.push({
        nombre: infoReal.nombre,
        precio: infoReal.precio,
        cantidad,
        color: item.color || null,
        talle: item.talle || null,
      });
    }

    const totalPedido = productosVerificados.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
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
      productosVerificados.map((producto) => {

        return DetallesPedido.create({

          PedidoIdPedido:
            pedido.id_pedido,

          nombre:
            producto.nombre,

          cantidad:
            producto.cantidad,

          precio_unitario:
            producto.precio,

          color:
            producto.color,

          talle:
            producto.talle,

          total:
            producto.precio * producto.cantidad
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