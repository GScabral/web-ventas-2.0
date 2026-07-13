import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getLayoutHome, getLayoutHomeBorrador } from "../../redux/action";

import HomeSectionsRenderer from "../../componentes/HomeSectionsRenderer";
import useMetaTags from "../../componentes/hooks/useMetaTags";

import "./home.css";

// Antes acá vivía todo el catálogo (filtros, grilla, paginado) más
// PromoStrip y Newsletter, en un orden fijo escrito directo en este
// JSX. Ese bloque de catálogo ahora es su propia sección
// (componentes/secciones/CatalogoSection.jsx). Home es solo un
// "renderer": pide el layout guardado (armado desde el panel admin →
// Diseño) y delega a HomeSectionsRenderer/sectionRegistry qué mostrar
// y en qué orden.
//
// modo="borrador" lo usa la Vista previa del admin (ver
// admin/diseno/PreviewHome.jsx) para ver los cambios sin publicar.
// modo="publicado" (default) es lo que ve cualquier visitante real.
const Home = ({ modo = "publicado" }) => {

  const dispatch = useDispatch();

  const layoutPublicado = useSelector(state => state.layoutHome);
  const layoutBorrador = useSelector(state => state.layoutHomeBorrador);
  const configuracion = useSelector(state => state.configuracion);

  // Sin título/descripción propios: en la portada alcanza con nombre +
  // tagline de la tienda (useMetaTags arma "Tienda" en vez de
  // "Home | Tienda").
  useMetaTags({});

  useEffect(() => {
    if (modo === "borrador") {
      dispatch(getLayoutHomeBorrador());
    } else {
      dispatch(getLayoutHome());
    }
  }, [modo, dispatch]);

  const layout = modo === "borrador" ? layoutBorrador : layoutPublicado;

  const secciones = layout?.secciones || [];

  // La sección "hero" (si está visible y tiene título cargado) ya pone
  // su propio <h1> — ver HeroSection.jsx. Pero el hero viene OCULTO por
  // defecto (seccionesPorDefecto.js) y puede quedar sin título aunque
  // esté visible, así que Home no puede asumir que ese <h1> exista:
  // sin ningún <h1> en toda la página, un lector de pantalla o un
  // crawler no tienen forma de saber cuál es el tema central de la
  // portada. Este de acá es visualmente invisible (sr-only) para no
  // duplicar el título grande del hero cuando SÍ está presente.
  const heroConTitulo = secciones.some(
    (s) => s.tipo === "hero" && s.visible && s.contenido?.titulo
  );

  return (

    <div className="home-fondo">

      <main className="home-wrapper">

        {!heroConTitulo && (
          <h1 className="sr-only">
            {configuracion?.nombre_tienda || "Tienda"}
            {configuracion?.tagline ? ` — ${configuracion.tagline}` : ""}
          </h1>
        )}

        <HomeSectionsRenderer secciones={secciones} />

      </main>

    </div>
  );
};

export default Home;
