import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfiguracion } from "../redux/action";
import { FUENTES, FUENTE_POR_DEFECTO } from "../config/fuentes";

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

    useEffect(() => {
        dispatch(getConfiguracion());
    }, [dispatch]);

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

        if (configuracion.nombre_tienda) {
            document.title = configuracion.nombre_tienda;
        }

    }, [configuracion]);

    return null;
};

export default ThemeLoader;
