const { DetallesPedido } = require('../../db');

const despacharDetalle = async (req, res) => {
    try {
        const { idDetalle } = req.params;

        // Buscar el detalle por su clave primaria
        const detalle = await DetallesPedido.findByPk(idDetalle);

        if (!detalle) {
            return res.status(404).json({ message: 'Detalle no encontrado' });
        }

        // Cambiar el estado del detalle
        detalle.estado_pedido = 'DESPACHADO';
        await detalle.save();

        res.json({ message: 'Detalle despachado correctamente', detalle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al despachar el pedido' });
    }
};

module.exports = despacharDetalle;
