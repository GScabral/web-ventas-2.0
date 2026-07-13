import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getOfertas } from "../../redux/action";
import useCatalogo from "../hooks/useCatalogo";

import Paginado from "../paginacion";
import FiltrosSidebar from "../../pages/Home/barralado/filtros";
import ProductGrid from "../../pages/Home/Cards/productGrid";

// Los estilos de catalog-layout/spinner viven en home.css. Se importa
// acá (y también en home.jsx, para el resto del layout) — los
// bundlers de CSS de Vite deduplican el mismo archivo sin problema.
import "../../pages/Home/home.css";

// Extraído tal cual de la Home vieja (antes de que existiera el editor
// de Diseño): catálogo con filtros de categoría/precio, grilla de
// productos y paginado. Es la única sección que se auto-contiene su
// propio estado (antes vivía como useState directo en home.jsx) para
// poder ser una pieza más del registro de secciones sin que el resto
// del Home tenga que saber nada de talles, categorías ni paginación.
//
// Desde que el catálogo se pagina/filtra en el servidor, toda esa
// lógica vive en useCatalogo.js (compartido con Catalogo.jsx) — acá
// sólo queda conectar la categoría inicial que llega por URL.
const CatalogoSection = () => {

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const categoriaDesdeUrl = searchParams.get("categoria") || "";

    const {
        productos,
        totalPages,
        currentPage,
        loading,
        categoria,
        setCategoria,
        tallas,
        setTallas,
        colores,
        setColores,
        precioMax,
        setPrecioMax,
        orden,
        setOrden,
        setPage,
    } = useCatalogo(categoriaDesdeUrl);

    useEffect(() => {
        dispatch(getOfertas());
    }, [dispatch]);

    const Spinner = () => (
        <div className="spinner-home">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
        </div>
    );

    return (

        <section className="home-section catalog-layout" id="catalogo">

            <aside className="catalog-sidebar">

                <FiltrosSidebar
                    selectedSubcategory={categoria}
                    setSelectedSubcategory={setCategoria}
                    selectedPriceOrder={orden}
                    setSelectedPriceOrder={setOrden}
                    tallas={tallas}
                    setTallas={setTallas}
                    colores={colores}
                    setColores={setColores}
                    precioMax={precioMax}
                    setPrecioMax={setPrecioMax}
                />

            </aside>

            <section className="catalog-products">

                {loading ? (

                    <div className="loading-container">
                        <Spinner />
                    </div>

                ) : (

                    <>
                        <ProductGrid productos={productos} />
                        <Paginado
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onChange={setPage}
                        />
                    </>

                )}

            </section>

        </section>
    );
};

export default CatalogoSection;
