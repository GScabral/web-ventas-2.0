// Valores de respaldo de la marca/tienda: SOLO se usan cuando todavía
// no hay una configuración cargada en la base (primer arranque). En
// cuanto el admin completa Diseño → Identidad y colores, esos datos
// pisan a estos en todos lados (ver el patrón `configuracion?.x ||
// STORE_CONFIG.x` en Footer, Nav, Terminos, etc.).
//
// Se dejan neutros a propósito: al instalar el sitio a un cliente
// nuevo, no queremos que aparezca el teléfono/dirección reales de otro
// negocio si alguien todavía no cargó los suyos. Todo esto es editable
// desde el panel, sin tocar código.

export const STORE_CONFIG = {
  name: "Mi Tienda",
  tagline: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  address: "",
  mapsUrl: "",
};

export default STORE_CONFIG;
