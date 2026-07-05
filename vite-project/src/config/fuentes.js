// Pares tipográficos curados para Personalización.
// Cada uno define una fuente "display" (títulos, hero, logo) y una
// "body" (texto general), pensados para combinar bien entre sí —
// por eso el admin elige un PAR, no dos fuentes sueltas.
//
// Los @import de Google Fonts de las 4 ya están precargados en
// Design-system.css, así que cambiar de opción acá es instantáneo
// (no hay que esperar a que baje una fuente nueva).

export const FUENTES = {
  clasica: {
    label: "Clásica",
    descripcion: "Serif editorial + sans limpia",
    display: "'Fraunces', 'Georgia', serif",
    body: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  moderna: {
    label: "Moderna",
    descripcion: "Geométrica, redondeada, amigable",
    display: "'Poppins', -apple-system, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  elegante: {
    label: "Elegante",
    descripcion: "Serif clásica + sans discreta",
    display: "'Playfair Display', 'Georgia', serif",
    body: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  minimal: {
    label: "Minimal",
    descripcion: "Técnica, angular, contemporánea",
    display: "'Space Grotesk', -apple-system, sans-serif",
    body: "'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const FUENTE_POR_DEFECTO = "moderna";

export default FUENTES;
