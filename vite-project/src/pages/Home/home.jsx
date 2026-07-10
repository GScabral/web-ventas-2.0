import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getProductos, getOfertas, filterProduc } from "../../redux/action";

import PromoStrip from "../../componentes/PromoStrip";
import Paginado from "../../componentes/paginacion";
import Newsletter from "../../componentes/Newsletter";
import FiltrosSidebar from "./barralado/filtros";
import ProductGrid from "./Cards/productGrid";

import "./home.css";

const Home = () => {

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const allProductos = useSelector(
    state => state.allProductos
  );

  const [loading, setLoading] = useState(true);

  const categoriaDesdeUrl = searchParams.get("categoria") || "";

  const [selectedSubcategory, setSelectedSubcategory] =
    useState(categoriaDesdeUrl);

  const [selectedPriceOrder, setSelectedPriceOrder] =
    useState("");

  useEffect(() => {

    setLoading(true);
    dispatch(getOfertas())
    dispatch(getProductos())
      .finally(() => setLoading(false));

  }, [dispatch]);

  // Si se llega desde un link del Nav con ?categoria=X (por ejemplo, al
  // tocar un chip de categoría), aplicamos ese filtro automáticamente.
  useEffect(() => {

    if (!categoriaDesdeUrl) return;

    setSelectedSubcategory(categoriaDesdeUrl);

    dispatch(
      filterProduc({
        categoria: categoriaDesdeUrl,
        subcategoria: ""
      })
    );

  }, [categoriaDesdeUrl, dispatch]);

  const Spinner = () => (
    <div className="spinner-home">
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </div>
  );

  return (

    <div className="home-fondo">

      <main className="home-wrapper">

        <section className="home-section">
          <PromoStrip />
        </section>

        <section className="home-section catalog-layout">

          <aside className="catalog-sidebar">

            <FiltrosSidebar
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedPriceOrder={selectedPriceOrder}
              setSelectedPriceOrder={setSelectedPriceOrder}
            />

          </aside>

          <section className="catalog-products">

            {loading ? (

              <div className="loading-container">
                <Spinner />
              </div>

            ) : (

              <>
                <ProductGrid productos={allProductos} />
                <Paginado />
              </>

            )}

          </section>

        </section>

        <section className="home-section newsletter-block">
          <Newsletter />
        </section>

      </main>

    </div>
  );
};

export default Home;
