import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfiguracion, getLayoutHome } from "../redux/action";
import { FUENTES, FUENTE_POR_DEFECTO } from "../config/fuentes";

// Nombres de las plantillas built-in que tienen una "presentación"
// propia definida en temas.css (grilla, forma de tarjetas, proporción
// de imagen, títulos). Si la plantilla activa es una de estas, se marca
// <html data-tema="..."> y esos estilos entran en juego. Las plantillas
// personalizadas (id aleatorio) no matchean ninguna: se quedan con la
// presentación base + los colores/fuente que hayan guardado.
const TEMAS_CON_PRESENTACION = [
    "minimalista", "urbano", "elegante", "impacto", "editorial", "outlet",
];

// Valores base de Design-system.css para --radius-* y --sp-4..--sp-9.
// "cuadrado"/"compacta" pisan estos tokens con números más chicos;
// "redondeado"/"amplia" (los valores por defecto de ConfiguracionSitio)
// restauran los originales — mismo mecanismo que los colores, nada de
// calc() ni recompilar CSS.
const RADIOS = {
    redondeado: { "--radius-sm": "8px", "--radius-md": "12px", "--radius-lg": "16px" },
    cuadrado: { "--radius-sm": "2px", "--radius-md": "4px", "--radius-lg": "6px" },
};

const DENSIDADES = {
    amplia: {
        "--sp-4": "16px", "--sp-5": "24px", "--sp-6": "32px",
        "--sp-7": "48px", "--sp-8": "64px", "--sp-9": "96px",
    },
    compacta: {
        "--sp-4": "12px", "--sp-5": "16px", "--sp-6": "20px",
        "--sp-7": "28px", "--sp-8": "36px", "--sp-9": "56px",
    },
};

// Tokens de texto/bordes según si el fondo elegido es claro u oscuro.
// Antes las plantillas tenían que mantener el fondo claro sí o sí,
// porque el color de texto era fijo (oscuro) y sobre un fondo oscuro
// quedaba ilegible. Con esto, ThemeLoader detecta la luminancia del
// fondo y ajusta el texto/bordes solo — así una plantilla puede tener
// fondo negro o azul noche y seguir siendo legible, lo que permite que
// las plantillas cambien la parte pública de forma mucho más notoria.
const TEXTO_CLARO = {
    "--text-primary": "#f5f6f8",
    "--text-secondary": "#c7ccd4",
    "--text-muted": "#9198a3",
    "--border-subtle": "rgba(255,255,255,0.10)",
    "--border-medium": "rgba(255,255,255,0.18)",
    // Superficie secundaria (inputs, chips) un punto más clara que el
    // fondo de tarjeta oscuro, para que se distinga.
    "--bg-elevated-2": "rgba(255,255,255,0.06)",
};

const TEXTO_OSCURO = {
    "--text-primary": "#1c2029",
    "--text-secondary": "#646d7a",
    "--text-muted": "#9aa1ac",
    "--border-subtle": "#edeef1",
    "--border-medium": "#e1e3e8",
    "--bg-elevated-2": "#eef0f3",
};

// Luminancia relativa aproximada de un color hex (#rgb o #rrggbb).
// Devuelve 0 (negro) a 1 (blanco). Se usa solo para decidir "fondo
// oscuro vs claro", no hace falta la fórmula perceptual exacta.
const esFondoOscuro = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6) return false;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return false;
    // Luminancia relativa (sRGB simplificada).
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminancia < 0.5;
};

// No renderiza nada visible: solo pide la configuración de marca
// (colores, tipografía, nombre de tienda) una vez al cargar el
// sitio, y la aplica como variables CSS sobre <html>. Como
// Design-system.css ya define --accent-terracota / --font-display /
// etc. en :root, y toda la hoja de estilos los usa con var(...),
// pintar estas variables en el elemento raíz alcanza para
// re-brandear todo el sitio (tienda + admin) sin tocar una línea
// de CSS por cliente.
const ThemeLoader = () => {

    const dispatch = useDispatch();

    const configuracion = useSelector(state => state.configuracion);
    const layoutHome = useSelector(state => state.layoutHome);

    useEffect(() => {
        dispatch(getConfiguracion());
        // También el layout publicado, para saber qué plantilla está
        // activa y aplicar su "presentación" (data-tema) en TODAS las
        // páginas — no solo en la Home, que ya lo pide por su cuenta.
        dispatch(getLayoutHome());
    }, [dispatch]);

    // Marca la plantilla activa como atributo en <html>, para que
    // temas.css cambie la forma de presentar las cosas (grilla,
    // tarjetas, etc.), no solo los colores.
    useEffect(() => {
        const activa = layoutHome?.plantilla_activa;
        const raiz = document.documentElement;
        if (activa && TEMAS_CON_PRESENTACION.includes(activa)) {
            raiz.setAttribute("data-tema", activa);
        } else {
            raiz.removeAttribute("data-tema");
        }
    }, [layoutHome]);

    useEffect(() => {

        if (!configuracion) return;

        const raiz = document.documentElement;

        if (configuracion.color_primario) {
            raiz.style.setProperty("--accent-terracota", configuracion.color_primario);
        }

        if (configuracion.color_secundario) {
            raiz.style.setProperty("--accent-mostaza", configuracion.color_secundario);
        }

        if (configuracion.color_acento) {
            raiz.style.setProperty("--accent-rosa", configuracion.color_acento);
        }

        const fuenteElegida = FUENTES[configuracion.fuente] || FUENTES[FUENTE_POR_DEFECTO];

        raiz.style.setProperty("--font-display", fuenteElegida.display);
        raiz.style.setProperty("--font-body", fuenteElegida.body);

        const radios = RADIOS[configuracion.radio_bordes] || RADIOS.redondeado;
        Object.entries(radios).forEach(([variable, valor]) =>
            raiz.style.setProperty(variable, valor)
        );

        const espaciado = DENSIDADES[configuracion.densidad] || DENSIDADES.amplia;
        Object.entries(espaciado).forEach(([variable, valor]) =>
            raiz.style.setProperty(variable, valor)
        );

        if (configuracion.color_fondo) {
            raiz.style.setProperty("--bg-base", configuracion.color_fondo);
        }

        if (configuracion.color_fondo_tarjetas) {
            raiz.style.setProperty("--bg-elevated", configuracion.color_fondo_tarjetas);
        }

        // Texto/bordes adaptados a la claridad del fondo. Se decide con
        // el fondo de tarjeta (donde se apoya la mayoría del contenido:
        // productos, secciones); si no está seteado, se usa el fondo de
        // página. Así una plantilla de fondo oscuro queda legible sin
        // tener que tocar CSS. Solo aplica al sitio público: el panel
        // admin define sus propios --text-*/--bg-* dentro de
        // .dashboardContainer, que ganan sobre estos de :root.
        const fondoReferencia =
            configuracion.color_fondo_tarjetas || configuracion.color_fondo;
        const tokensTexto = esFondoOscuro(fondoReferencia) ? TEXTO_CLARO : TEXTO_OSCURO;
        Object.entries(tokensTexto).forEach(([variable, valor]) =>
            raiz.style.setProperty(variable, valor)
        );

        // El <title> por página ahora lo maneja useMetaTags.js (Home,
        // Detail, Catálogo, Ofertas). Antes esta línea competía con esos
        // hooks: si getConfiguracion() resolvía DESPUÉS de que la página
        // ya hubiera puesto su propio título ("Campera X | Tienda"), acá
        // se lo pisaba de vuelta a solo "Tienda". useMetaTags ya lee
        // nombre_tienda de este mismo store, así que sigue quedando
        // correcto sin esta línea.

    }, [configuracion]);

    return null;
};

export default ThemeLoader;
