import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfiguracion } from "../redux/action";

// No renderiza nada visible: solo pide la configuración de marca
// (colores + nombre de tienda) una vez al cargar el sitio, y la
// aplica como variables CSS sobre <html>. Como Design-system.css
// ya define --accent-terracota / --accent-mostaza / --accent-rosa
// en :root, y toda la hoja de estilos los usa con var(...), pintar
// estas 3 variables en el elemento raíz alcanza para re-brandear
// todo el sitio (tienda + admin) sin tocar una línea de CSS.
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

        if (configuracion.nombre_tienda) {
            document.title = configuracion.nombre_tienda;
        }

    }, [configuracion]);

    return null;
};

export default ThemeLoader;
