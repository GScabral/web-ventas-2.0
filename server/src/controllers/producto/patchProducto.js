const { variantesproductos } = require('../../db');

const actualizarCantidadDisponibleVariante = async (idVariante, cantidad) => {


  

  try {
    const variante = await variantesproductos.findByPk(idVariante);

    if (!variante) {
      console.log("Variante no encontrada");
      return;
    }

    if (variante.cantidad_disponible < cantidad) {
      console.log("La cantidad disponible es insuficiente");
      return;
    }

    if (variante.cantidad_disponible <= 0) {
      console.log("La cantidad disponible es insuficiente");
      return;
    }

    variante.cantidad_disponible -= cantidad;

    await variante.save();

  } catch (error) {
    console.error("Error al actualizar la cantidad disponible de la variante:", error);
  }
};


module.exports = actualizarCantidadDisponibleVariante;