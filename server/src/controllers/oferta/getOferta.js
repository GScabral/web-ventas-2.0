const { oferta } = require('../../db');

const getOfertasActivas = async () => {
    try {
      // OJO: a pesar del nombre, esto trae TODAS las ofertas (vencidas,
      // vigentes y futuras) — es a propósito: el panel de admin
      // (listadoOFertas.jsx) necesita ver también las vencidas para
      // poder borrarlas, y muestra su propio badge "Activa"/"Finalizada"
      // calculado ahí mismo. El filtrado por fecha para saber si una
      // oferta debe aplicar un descuento real se hace en el punto de
      // uso (Card.jsx), no acá, para no romper esa pantalla.
      const ofertasActivas = await oferta.findAll();

      return ofertasActivas;
    } catch (error) {
      console.error('Error al obtener ofertas activas:', error);
      throw error; // Propaga el error para manejarlo en el contexto superior
    }
  };
  
  module.exports = getOfertasActivas;