const { Banner } = require('../../db');

const actualizarBanner = async (id, datos) => {
    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            throw new Error(`Banner con id ${id} no encontrado`);
        }

        const camposEditables = [
            'tipo', 'eyebrow', 'titulo', 'textoBoton',
            'link', 'imagen', 'color', 'orden', 'activo',
            'inicio', 'fin'
        ];

        camposEditables.forEach((campo) => {
            if (datos[campo] !== undefined) {
                banner[campo] = datos[campo];
            }
        });

        await banner.save();

        return banner;
    } catch (error) {
        console.error('Error al actualizar el banner:', error);
        throw error;
    }
};

module.exports = actualizarBanner;
