const { ZonaEnvioMoto } = require("../../db");
const normalizar = require("../../utils/normalizarTexto");

// Se usa en el checkout público (para ofrecer la opción "moto" solo
// si la ciudad tipeada tiene zona cargada) y de nuevo del lado del
// servidor al crear el pedido (nunca se confía en lo que mande el
// navegador). Si no hay match, encontrado:false — el frontend no debe
// mostrar la opción de moto en ese caso.
const calcularCostoMoto = async (ciudad) => {

    if (!ciudad) {
        return { costo: 0, encontrado: false };
    }

    const todas = await ZonaEnvioMoto.findAll({ where: { activo: true } });

    const ciudadNormalizada = normalizar(ciudad);

    const match = todas.find(
        (z) => normalizar(z.ciudad) === ciudadNormalizada
    );

    if (!match) {
        return { costo: 0, encontrado: false };
    }

    return { costo: Number(match.costo), encontrado: true };
};

module.exports = calcularCostoMoto;
