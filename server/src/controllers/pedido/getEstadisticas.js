const { Pedido, DetallesPedido } = require("../../db");
const { Op } = require("sequelize");

// Estadísticas para el dashboard de Inicio del admin: total vendido en
// distintos rangos, el producto más vendido, y una serie diaria para
// el gráfico. Se excluyen los pedidos cancelados de todos los totales
// (no cuentan como venta real), pero se cuentan pendientes/preparando/
// enviados/entregados por igual, porque el sitio no tiene todavía un
// estado "pagado" confirmado de forma automática (el pago se coordina
// por WhatsApp después de crear el pedido).
const getEstadisticas = async () => {

    const ahora = new Date();

    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);

    const inicioSemana = new Date(inicioHoy);
    inicioSemana.setDate(inicioSemana.getDate() - 6);

    const inicioMes = new Date(inicioHoy);
    inicioMes.setDate(1);

    // 30 días para el gráfico (incluye "hoy")
    const inicioGrafico = new Date(inicioHoy);
    inicioGrafico.setDate(inicioGrafico.getDate() - 29);

    const pedidosDelPeriodo = await Pedido.findAll({
        where: {
            estado: { [Op.ne]: "cancelado" },
            fecha_pedido: { [Op.gte]: inicioGrafico },
        },
        include: [DetallesPedido],
        order: [["fecha_pedido", "ASC"]],
    });

    const sumaEnRango = (desde) =>
        pedidosDelPeriodo
            .filter(p => new Date(p.fecha_pedido) >= desde)
            .reduce((acc, p) => acc + Number(p.total_pedido || 0), 0);

    const ventasHoy = sumaEnRango(inicioHoy);
    const ventasSemana = sumaEnRango(inicioSemana);
    const ventasMes = sumaEnRango(inicioMes);

    // Producto más vendido (por cantidad total de unidades), sobre el
    // mismo período de 30 días que trae el gráfico.
    const cantidadPorProducto = {};

    for (const pedido of pedidosDelPeriodo) {
        for (const detalle of (pedido.DetallesPedidos || [])) {
            const nombre = detalle.nombre || "Producto sin nombre";
            cantidadPorProducto[nombre] = (cantidadPorProducto[nombre] || 0) + detalle.cantidad;
        }
    }

    let productoMasVendido = null;

    for (const [nombre, cantidad] of Object.entries(cantidadPorProducto)) {
        if (!productoMasVendido || cantidad > productoMasVendido.cantidad) {
            productoMasVendido = { nombre, cantidad };
        }
    }

    // Serie diaria para el gráfico: un total por día, completando con
    // $0 los días sin ventas (para que el gráfico no tenga huecos).
    const totalesPorDia = {};

    for (const pedido of pedidosDelPeriodo) {
        const fecha = new Date(pedido.fecha_pedido).toISOString().slice(0, 10);
        totalesPorDia[fecha] = (totalesPorDia[fecha] || 0) + Number(pedido.total_pedido || 0);
    }

    const ventasPorDia = [];

    for (let i = 0; i < 30; i++) {
        const dia = new Date(inicioGrafico);
        dia.setDate(dia.getDate() + i);
        const clave = dia.toISOString().slice(0, 10);

        ventasPorDia.push({
            fecha: clave,
            total: totalesPorDia[clave] || 0,
        });
    }

    return {
        ventasHoy,
        ventasSemana,
        ventasMes,
        productoMasVendido,
        ventasPorDia,
    };
};

module.exports = getEstadisticas;
