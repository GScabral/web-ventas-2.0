const { Banner } = require('../../db');
const { Op } = require('sequelize');

// Devuelve solo los banners que un visitante de la tienda debería ver
// ahora mismo: marcados como activos, y si tienen fechas de vigencia
// cargadas, que la fecha actual esté dentro de ese rango.
const getBannersActivos = async () => {
    try {
        const ahora = new Date();

        const banners = await Banner.findAll({
            where: {
                activo: true,
                [Op.and]: [
                    {
                        [Op.or]: [
                            { inicio: null },
                            { inicio: { [Op.lte]: ahora } }
                        ]
                    },
                    {
                        [Op.or]: [
                            { fin: null },
                            { fin: { [Op.gte]: ahora } }
                        ]
                    }
                ]
            },
            order: [['tipo', 'ASC'], ['orden', 'ASC']]
        });

        return banners;
    } catch (error) {
        console.error('Error al obtener los banners activos:', error);
        throw error;
    }
};

module.exports = getBannersActivos;
