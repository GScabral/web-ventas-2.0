const { Banner } = require('../../db');

const eliminarBanner = async (id) => {
    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            throw new Error(`Banner con id ${id} no encontrado`);
        }

        await banner.destroy();

        return { mensaje: 'Banner eliminado' };
    } catch (error) {
        console.error('Error al eliminar el banner:', error);
        throw error;
    }
};

module.exports = eliminarBanner;
