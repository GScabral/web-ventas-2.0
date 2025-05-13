const {DetallesPedido}=require('../../models/detallesPedidos')


const deleteDetallePedidoById = async (id) => {
    try {
      const deletedDetallePedido = await DetallesPedido.destroy({ where: { id_detalle_pedido: id } });
      return deletedDetallePedido;
    } catch (error) {
      console.error('Error al eliminar detalle de pedido:', error);
      throw error;
    }
  };
  
module.exports = deleteDetallePedidoById;