// controllers/categorias/getCategorias.js

const { Categorias } = require("../../db");

const getCategorias = async () => {

  return await Categorias.findAll({
    order: [["nombre", "ASC"]]
  });

};

module.exports = getCategorias;