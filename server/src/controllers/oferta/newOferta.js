const { oferta } = require('../../db'); // Asegúrate de importar desde la ubicación correcta

const crearOferta = async (infOferta) => {

  try {
    const { producto_id, descuento, inicio, fin } = infOferta.oferta;

    const nuevaOferta = await oferta.create({
      producto_id,
      descuento,
      inicio,
      fin,
    });

    return nuevaOferta;
  } catch (error) {
    console.error('Error al crear la oferta:', error);
    throw error; // Propaga el error para manejarlo en el contexto superior
  }
};

module.exports = crearOferta;

