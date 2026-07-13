import { useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../../redux/action";

// Las imágenes de producto pueden venir como URL absoluta (Cloudinary)
// o como ruta relativa tipo "/uploads/x.jpg" servida por el backend, no
// por el frontend — mandar la ruta relativa tal cual en og:image
// apuntaría al origen del frontend, donde ese archivo no existe.
const resolverUrlImagen = (imagen) => {
  if (!imagen) return "";
  if (/^https?:\/\//i.test(imagen)) return imagen;
  return `${API_URL}${imagen.startsWith("/") ? "" : "/"}${imagen}`;
};

// Crea la etiqueta <meta> si no existe, o actualiza su "content" si ya
// está. selector busca por name= o por property= (los OG van con
// property, el resto con name).
const upsertMeta = (attr, value, content) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

// Título/descripción/imagen dinámicos por página — antes todo el sitio
// compartía el único <title>/<meta description> estáticos de
// index.html (pisados sólo por el nombre de tienda vía ThemeLoader.jsx),
// así que Home, un producto puntual y el catálogo mostraban exactamente
// lo mismo en la pestaña del navegador y en Google.
//
// Importante: esto ayuda a la pestaña del navegador y a crawlers que
// ejecutan JavaScript (como Googlebot). NO ayuda a las previsualizaciones
// de link que NO ejecutan JS (WhatsApp, Facebook, Twitter) — esas leen
// el HTML estático de index.html tal cual llega del servidor, antes de
// que React corra. Arreglar eso de raíz requiere server-side rendering o
// pre-renderizado por ruta, que es un cambio de arquitectura aparte (ver
// el punto de SSR del informe).
const useMetaTags = ({ title, description, image, type = "website" } = {}) => {

  const configuracion = useSelector(state => state.configuracion);

  const nombreTienda = configuracion?.nombre_tienda || "Tienda";
  const descripcionPorDefecto = configuracion?.tagline || "Comprá online con envíos y pago por Mercado Pago.";
  const imagenPorDefecto = configuracion?.logo_url || "";

  useEffect(() => {

    const tituloFinal = title
      ? `${title} | ${nombreTienda}`
      : nombreTienda;

    const descripcionFinal = description || descripcionPorDefecto;
    const imagenFinal = resolverUrlImagen(image || imagenPorDefecto);

    document.title = tituloFinal;

    upsertMeta("name", "description", descripcionFinal);

    upsertMeta("property", "og:title", tituloFinal);
    upsertMeta("property", "og:description", descripcionFinal);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", window.location.href);

    if (imagenFinal) {
      upsertMeta("property", "og:image", imagenFinal);
    }

    upsertMeta("name", "twitter:card", imagenFinal ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", tituloFinal);
    upsertMeta("name", "twitter:description", descripcionFinal);

  }, [title, description, image, type, nombreTienda, descripcionPorDefecto, imagenPorDefecto]);
};

export default useMetaTags;
