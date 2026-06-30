const { Banner } = require('../../db');

const getBanners = async () => {
    try {
        const banners = await Banner.findAll({
            order: [['tipo', 'ASC'], ['orden', 'ASC']]
        });

        return banners;
    } catch (error) {
        console.error('Error al obtener los banners:', error);
        throw error;
    }
};

module.exports = getBanners;
