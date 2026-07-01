const { ConfiguracionSitio } = require("../../db");

// Siempre trabajamos con una única fila (id fijo 1). Si todavía no
// existe (primera vez que se pide), se crea con los valores por
// defecto del modelo, así el sitio nunca se queda sin config.
const getConfiguracion = async () => {

  const [configuracion] = await ConfiguracionSitio.findOrCreate({
    where: { id: 1 },
  });

  return configuracion;
};

module.exports = getConfiguracion;
