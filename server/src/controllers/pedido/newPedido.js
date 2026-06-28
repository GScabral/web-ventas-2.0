const { Pedido, DetallesPedido, Productos, oferta, variantesproductos, conn } = require("../../db");
const { Op } = require("sequelize");

// Error "esperado": stock insuficiente, producto inexistente, etc.
// Se distingue de errores técnicos para devolver 400 con un mensaje
// que el comprador pueda entender, en vez de un 500 genérico.
class ErrorPedido extends Error {}

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
    //
    // Todo esto corre dentro de una transacción con bloqueo de fila
    // (FOR UPDATE) sobre la variante vendida: si dos compras del mismo
    // producto llegan casi al mismo tiempo, la segunda espera a que la
    // primera termine de leer y descontar el stock antes de chequear el
    // suyo. Sin esto, ambas podrían leer "hay 1 disponible" al mismo
    // tiempo y vender 2 unidades de algo que solo había 1.
    const resultado = await conn.transaction(async (t) => {

      const productosVerificados = [];

      for (const item of productos) {
        const idProducto = item.id || item.id_producto;

        if (!idProducto) {
          throw new ErrorPedido(
            `Falta el id del producto "${item.nombre || ""}"`
          );
        }

        const infoReal = await obtenerPrecioReal(idProducto);

        if (!infoReal) {
          throw new ErrorPedido(
            `Producto con id ${idProducto} no encontrado`
          );
        }

        const cantidad = Number(
          item.cantidad ||
          item.cantidad_elegida ||
          1
        );

        const idVariante =
          item.idVariante ||
          item.id_variante ||
          null;

        let variante = null;

        if (idVariante) {

          // Bloquea la fila de esta variante hasta que la transacción
          // termine, para que ninguna otra venta simultánea la toque
          // mientras decidimos si hay stock suficiente.
          variante = await variantesproductos.findByPk(
            idVariante,
            { transaction: t, lock: t.LOCK.UPDATE }
          );

          if (!variante) {
            throw new ErrorPedido(
              `La variante seleccionada de "${infoReal.nombre}" ya no existe`
            );
          }

          if (variante.cantidad_disponible < cantidad) {
            throw new ErrorPedido(
              `No queda stock suficiente de "${infoReal.nombre}"` +
              (item.talle ? ` (talle ${item.talle}` : "") +
              (item.color ? `${item.talle ? ", " : " ("}color ${item.color})` : (item.talle ? ")" : "")) +
              `. Quedan ${variante.cantidad_disponible} unidades.`
            );
          }

          await variante.decrement(
            "cantidad_disponible",
            { by: cantidad, transaction: t }
          );
        }

        productosVerificados.push({
          nombre: infoReal.nombre,
          precio: infoReal.precio,
          cantidad,
          color: item.color || null,
          talle: item.talle || null,
          idVariante,
        });
      }

      const totalPedido = productosVerificados.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );

      const pedido = await Pedido.create(
        {
          email_cliente: emailCliente,
          nombre: nombreCliente,
          telefono: telefonoCliente,
          provincia: provinciaCliente,
          ciudad: ciudadCliente,
          direccion: direccionCliente,
          tipo_entrega: tipoEntrega,
          total_pedido: totalPedido,
          estado: "pendiente"
        },
        { transaction: t }
      );

      await Promise.all(
        productosVerificados.map((producto) => {

          return DetallesPedido.create(
            {
              PedidoIdPedido: pedido.id_pedido,
              id_variante: producto.idVariante,
              nombre: producto.nombre,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio,
              color: producto.color,
              talle: producto.talle,
              total: producto.precio * producto.cantidad
            },
            { transaction: t }
          );

        })
      );

      return pedido;
    });

    const pedidoCompleto =
      await Pedido.findByPk(
        resultado.id_pedido,
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

    if (error instanceof ErrorPedido) {
      return res.status(400).json({
        error: error.message
      });
    }

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