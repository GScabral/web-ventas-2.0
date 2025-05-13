const {DetallesPedido}=require('../../models/detallesPedidos')

const getDetallesPedido =  async (id) =>{
      try {
        const detallePedido = await DetallesPedido.findByPk(id);
        return detallePedido;
      } catch (error) {
        console.error('Error al obtener detalle de pedido:', error);
        throw error;
      }
    };

module.exports = getDetallesPedido;

