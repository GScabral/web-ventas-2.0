const { variantesproductos } = require('../../db');

const actualizarCantidadDisponibleVariante = async (idVariante, cantidad) => {


  

  try {
    const variante = await variantesproductos.findByPk(idVariante);

    if (!variante) {
      return;
    }

    if (variante.cantidad_disponible < cantidad) {
      return;
    }

    if (variante.cantidad_disponible <= 0) {
      return;
    }

    variante.cantidad_disponible -= cantidad;

    await variante.save();

  } catch (error) {
    console.error("Error al actualizar la cantidad disponible de la variante:", error);
  }
};


module.exports = actualizarCantidadDisponibleVariante;