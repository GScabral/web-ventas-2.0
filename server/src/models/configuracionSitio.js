const { DataTypes } = require("sequelize");

// Tabla de una sola fila: la personalización de ESTA tienda.
// Como es una tabla nueva, se crea sola la próxima vez que
// arranque el servidor la PRIMERA vez. Si le agregás columnas
// nuevas más adelante (como se hizo acá), hay que sumarlas
// también a mano con ALTER TABLE, porque conn.sync({force:false})
// no altera tablas que ya existen — solo crea las que faltan.
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

    // Frase corta debajo del logo/nombre (hero, footer "Sobre nosotros").
    tagline: {
      type: DataTypes.STRING(150),
      defaultValue: "Moda accesible para todos los días",
    },

    // URL de una imagen ya subida (Cloudinary, o cualquier hosting de
    // imágenes). No hay upload de archivo desde acá todavía, se pega
    // el link igual que en Banners.
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
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

    // Par tipográfico. Ver vite-project/src/config/fuentes.js para
    // el detalle de qué fuentes reales carga cada clave.
    fuente: {
      type: DataTypes.STRING(20),
      defaultValue: "clasica",
    },

    // Contacto / redes — reemplazan a config/storeConfig.js, que
    // hasta ahora era el único lugar donde se podían editar (y
    // requería tocar código).
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    instagram: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    facebook: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    maps_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // A dónde avisar cuando entra un pedido nuevo. Si queda vacío,
    // simplemente no se manda ningún aviso (no es obligatorio).
    email_notificaciones: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    // Monto a partir del cual el envío sale gratis (se compara contra
    // el subtotal del carrito antes de sumar costo_envio). null o 0
    // significa "sin envío gratis configurado" — nunca se aplica.
    envio_gratis_desde: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // ---- Control visual extendido (más allá de color/fuente) ----
    // "cuadrado" achica --radius-sm/md/lg en Design-system.css (mismo
    // mecanismo que los colores: ThemeLoader las pisa sobre <html>).
    radio_bordes: {
      type: DataTypes.STRING(20),
      defaultValue: "redondeado", // "redondeado" | "cuadrado"
    },

    // "compacta" achica la escala de espaciado --sp-4 a --sp-9.
    densidad: {
      type: DataTypes.STRING(20),
      defaultValue: "amplia", // "amplia" | "compacta"
    },

    // Fondo de página (pisa --bg-base) y fondo de tarjetas/superficies
    // (pisa --bg-elevated). Se mantienen claros por defecto: los
    // colores de texto (--text-primary, etc.) no son "theme-aware"
    // todavía, así que un fondo oscuro dejaría el texto ilegible.
    color_fondo: {
      type: DataTypes.STRING(7),
      defaultValue: "#f5f6f8",
    },

    color_fondo_tarjetas: {
      type: DataTypes.STRING(7),
      defaultValue: "#ffffff",
    },

  });

  return ConfiguracionSitio;
};
