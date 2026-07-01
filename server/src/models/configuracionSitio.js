const { DataTypes } = require("sequelize");

// Tabla de una sola fila: la personalización de ESTA tienda
// (colores de marca y nombre). Como es una tabla nueva, se crea
// sola la próxima vez que arranque el servidor (conn.sync no
// altera tablas existentes, pero sí crea las que faltan).
module.exports = (sequelize) => {

  const ConfiguracionSitio = sequelize.define("ConfiguracionSitio", {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre_tienda: {
      type: DataTypes.STRING(100),
      defaultValue: "Mi Tienda",
    },

    // Los 3 acentos de marca que usa Design-system.css. Se guardan
    // como hex (#rrggbb) y se validan en el controller antes de
    // guardarlos, para no terminar con CSS roto si alguien manda
    // cualquier cosa.
    color_primario: {
      type: DataTypes.STRING(7),
      defaultValue: "#ff6b35", // terracota
    },

    color_secundario: {
      type: DataTypes.STRING(7),
      defaultValue: "#e8a33d", // mostaza
    },

    color_acento: {
      type: DataTypes.STRING(7),
      defaultValue: "#d6708a", // rosa
    },

  });

  return ConfiguracionSitio;
};
