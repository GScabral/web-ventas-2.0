import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getProductos, getOfertas, filterProduc } from "../../redux/action";

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
const CatalogoSection = () => {

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const allProductos = useSelector(state => state.allProductos);

    const [loading, setLoading] = useState(true);

    const categoriaDesdeUrl = searchParams.get("categoria") || "";

    const [selectedSubcategory, setSelectedSubcategory] =
        useState(categoriaDesdeUrl);

    const [selectedPriceOrder, setSelectedPriceOrder] =
        useState("");

    useEffect(() => {

        setLoading(true);
        dispatch(getOfertas());
        dispatch(getProductos())
            .finally(() => setLoading(false));

    }, [dispatch]);

    // Si se llega desde un link con ?categoria=X (por ejemplo, un chip
    // de categoría en la sección "categorias" o el Nav), se aplica ese
    // filtro automáticamente.
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

        <section className="home-section catalog-layout" id="catalogo">

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
    );
};

export default CatalogoSection;
