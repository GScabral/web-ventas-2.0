const { Pedido, DetallesPedido } = require('../../db');

const getPedidos = async () => {
    try {
        // Consultar todos los pedidos incluyendo los detalles asociados
        const pedidosConDetalle = await Pedido.findAll({ include: DetallesPedido });

        // Formatear los resultados
        const pedidos = pedidosConDetalle.map((pedido) => {
            return {
                id: pedido.id_pedido,
                fecha: pedido.fecha_pedido,
                
                detalles: pedido.DetallesPedidos.map((detalle) => ({
                    idDetalle: detalle.id_detalle_pedido,
                    nombre:detalle.nombre,
                    cantidad: detalle.cantidad,    
                    color:detalle.color,
                    talle:detalle.talle,
                    total:detalle.total                              
                })),
            };
        });

        return pedidos;
    } catch (error) {
        console.error("Error al obtener la información de los pedidos:", error.message);
        throw error;
    }
};

module.exports = getPedidos;
