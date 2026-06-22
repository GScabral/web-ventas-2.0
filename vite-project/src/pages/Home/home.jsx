import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProductos, getOfertas } from "../../redux/action";

import Hero from "../../componentes/hero";
import Footer from "../Home/footer/Footer";
import Paginado from "../../componentes/paginacion";
import TrendingSection from "../../componentes/TrendingSection";
import EditorialGrid from "../../componentes/EditorialGrid";
import PromoBanner from "../../componentes/PromoBanner";
import Newsletter from "../../componentes/Newsletter";
import FiltrosSidebar from "./barralado/filtros";
import ProductGrid from "./Cards/productGrid";

import "./home.css";

const Home = () => {

  const dispatch = useDispatch();

  const allProductos = useSelector(
    state => state.allProductos
  );




  const [loading, setLoading] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  const [selectedPriceOrder, setSelectedPriceOrder] =
    useState("");

  useEffect(() => {

    setLoading(true);
    dispatch(getOfertas())
    dispatch(getProductos())
      .finally(() => setLoading(false));

  }, [dispatch]);

  const heroProductos = allProductos.filter(producto =>
    producto.sections?.some(
      section => section.section === "hero"
    )
  );

  const trendingProductos = allProductos.filter(producto =>
    producto.sections?.some(
      section => section.section === "trending"
    )
  );

  const principalProductos = allProductos.filter(producto =>
    producto.sections?.some(
      section => section.section === "principal"
    )
  );

  const bannerProductos = allProductos.filter(producto =>
    producto.sections?.some(
      section => section.section === "banner"
    )
  );

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

        {/* HERO */}

        <section className="home-section hero-block">
          <Hero productos={heroProductos} />
        </section>

        {/* BANNER */}

        <section className="home-section banner-block">
          <PromoBanner productos={bannerProductos} />
        </section>

        {/* SHOWCASE */}

        <section className="home-section showcase-section">

          <div className="showcase-column">
            <TrendingSection
              productos={trendingProductos}
            />
          </div>

          <div className="showcase-column">
            <EditorialGrid
              productos={principalProductos}
            />
          </div>

        </section>

        {/* CATALOGO */}

        <section className="home-section catalog-layout">

          <aside className="catalog-sidebar">

            <FiltrosSidebar
              selectedMainCategory="Ropa"
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

        {/* NEWSLETTER */}

        <section className="home-section newsletter-block">
          <Newsletter />
        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Home;