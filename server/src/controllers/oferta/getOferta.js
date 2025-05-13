const { oferta } = require('../../db'); 
const {Op}=require('sequelize')

const getOfertasActivas = async () => {
    try {
      // Consulta todas las ofertas activas
      const ofertasActivas = await oferta.findAll();
  
      return ofertasActivas;
    } catch (error) {
      console.error('Error al obtener ofertas activas:', error);
      throw error; // Propaga el error para manejarlo en el contexto superior
    }
  };
  
  module.exports = getOfertasActivas;