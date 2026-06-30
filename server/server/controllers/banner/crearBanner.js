const { Banner } = require('../../db');

const crearBanner = async (datos) => {
    try {
        const {
            tipo,
            eyebrow,
            titulo,
            textoBoton,
            link,
            imagen,
            color,
            orden,
            activo,
            inicio,
            fin
        } = datos;

        if (!titulo) {
            throw new Error('El banner necesita un título.');
        }

        const nuevoBanner = await Banner.create({
            tipo: tipo || 'main',
            eyebrow,
            titulo,
            textoBoton: textoBoton || 'Ver más',
            link: link || '/catalogo',
            imagen: imagen || null,
            color: color || null,
            orden: orden ?? 0,
            activo: activo ?? true,
            inicio: inicio || null,
            fin: fin || null,
        });

        return nuevoBanner;
    } catch (error) {
        console.error('Error al crear el banner:', error);
        throw error;
    }
};

module.exports = crearBanner;
