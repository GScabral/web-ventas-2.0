import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getLayoutHome, getLayoutHomeBorrador } from "../../redux/action";

import HomeSectionsRenderer from "../../componentes/HomeSectionsRenderer";

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

  useEffect(() => {
    if (modo === "borrador") {
      dispatch(getLayoutHomeBorrador());
    } else {
      dispatch(getLayoutHome());
    }
  }, [modo, dispatch]);

  const layout = modo === "borrador" ? layoutBorrador : layoutPublicado;

  return (

    <div className="home-fondo">

      <main className="home-wrapper">

        <HomeSectionsRenderer secciones={layout?.secciones || []} />

      </main>

    </div>
  );
};

export default Home;
