const {DetallesPedido}=require('../../models/detallesPedidos')

const createDetallePedido =async (detallePedidoData) =>{
    try {
      const newDetallePedido = await DetallesPedido.create(detallePedidoData);
      return newDetallePedido;
    } catch (error) {
      console.error('Error al crear detalle de pedido:', error);
      throw error;
    }
  }

module.exports=createDetallePedido;