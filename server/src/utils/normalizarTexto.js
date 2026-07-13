// Antes esta misma función vivía duplicada, casi idéntica, en
// calcularCostoEnvio.js y calcularCostoMoto.js (una con
// /[̀-ͯ]/g, la otra con /\p{Mn}/gu — equivalentes en la
// práctica, pero duplicadas igual). Se centraliza acá para que ambos
// "calcular costo de envío" comparen ciudad/provincia con el mismo
// criterio, y para poder testear la normalización una sola vez.
//
// \p{Mn} = categoría Unicode "Mark, nonspacing": los acentos/tildes que
// quedan sueltos después de normalize("NFD"). Así "Córdoba", "cordoba"
// y "CORDOBA" comparan igual.
const REGEX_ACENTOS = /\p{Mn}/gu;

const normalizarTexto = (texto) =>
  (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(REGEX_ACENTOS, "")
    .trim();

module.exports = normalizarTexto;
