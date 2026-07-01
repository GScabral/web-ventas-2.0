import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfiguracion } from "../redux/action";
import { FUENTES, FUENTE_POR_DEFECTO } from "../config/fuentes";

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

        if (configuracion.nombre_tienda) {
            document.title = configuracion.nombre_tienda;
        }

    }, [configuracion]);

    return null;
};

export default ThemeLoader;
