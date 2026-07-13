const { CostoEnvio } = require("../../db");
const normalizar = require("../../utils/normalizarTexto");

// Se usa en dos lugares: el checkout público (para mostrar el costo
// antes de confirmar) y la creación real del pedido (que vuelve a
// calcularlo del lado del servidor, nunca confía en lo que mande el
// navegador). Si no hay una provincia cargada que coincida, devuelve
// costo 0 y encontrado:false — el pedido igual se puede crear, el
// envío se coordina a mano en ese caso.
const calcularCostoEnvio = async (provincia) => {

    if (!provincia) {
        return { costo: 0, encontrado: false };
    }

    const todas = await CostoEnvio.findAll({ where: { activo: true } });

    const provinciaNormalizada = normalizar(provincia);

    const match = todas.find(
        (c) => normalizar(c.provincia) === provinciaNormalizada
    );

    if (!match) {
        return { costo: 0, encontrado: false };
    }

    return { costo: Number(match.costo), encontrado: true };
};

module.exports = calcularCostoEnvio;
