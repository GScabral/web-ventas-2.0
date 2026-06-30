import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getProductos } from "../../../redux/action";

import FiltrosSidebar from "../barralado/filtros";
import ProductGrid from "../Cards/productGrid";
import Paginado from "../../../componentes/paginacion";
import Footer from "../footer/Footer";

import "./catalogo.css";

const Catalogo = () => {

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const productos = useSelector(
        state => state.allProductos
    );

    const [loading, setLoading] = useState(true);

    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

    useEffect(() => {
        setLoading(true);
        dispatch(getProductos()).finally(() => setLoading(false));
    }, [dispatch]);

    // ?orden=recientes (el link de "Recién llegado" del banner) ordena
    // localmente por fecha de creación, sin pisar el orden por precio
    // que ya maneja el sidebar de filtros.
    const productosOrdenados = useMemo(() => {
        if (searchParams.get("orden") !== "recientes") return productos;

        return [...(productos || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [productos, searchParams]);

    return (

        <div className="catalogo-page">

            <div className="catalogo-wrapper">

                <div className="catalogo-header">
                    <h1>Catálogo completo</h1>
                    <p>{productos?.length || 0} productos</p>
                </div>

                <div className="catalogo-layout">

                    <aside className="catalogo-sidebar">

                        <FiltrosSidebar
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                            selectedPriceOrder={selectedPriceOrder}
                            setSelectedPriceOrder={setSelectedPriceOrder}
                        />

                    </aside>

                    <section className="catalogo-products">

                        {loading ? (
                            <p className="catalogo-loading">Cargando productos...</p>
                        ) : (
                            <>
                                <ProductGrid productos={productosOrdenados} />
                                <Paginado />
                            </>
                        )}

                    </section>

                </div>

            </div>

            <Footer />

        </div>
    );
};

export default Catalogo;
