// Las 24 jurisdicciones de Argentina (23 provincias + CABA), con el
// nombre canónico. Se usa para la carga masiva desde el panel de Envíos
// ("agregar todas las provincias faltantes") y como referencia del
// selector del checkout. Mismos nombres que la lista del frontend
// (vite-project/src/config/provinciasAR.js) para que el match sea
// siempre exacto.
const PROVINCIAS_AR = [
    "Buenos Aires",
    "Ciudad Autónoma de Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
];

module.exports = PROVINCIAS_AR;
