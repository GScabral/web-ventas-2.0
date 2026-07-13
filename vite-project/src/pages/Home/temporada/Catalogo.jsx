import React from "react";

import useCatalogo from "../../../componentes/hooks/useCatalogo";
import useMetaTags from "../../../componentes/hooks/useMetaTags";

import FiltrosSidebar from "../barralado/filtros";
import ProductGrid from "../Cards/productGrid";
import Paginado from "../../../componentes/paginacion";

import "./catalogo.css";

const Catalogo = () => {

    useMetaTags({
        title: "Catálogo completo",
        description: "Descubrí todos los productos disponibles: filtrá por categoría, talle, color y precio.",
    });

    const {
        productos,
        total,
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
    } = useCatalogo();

    return (

        <div className="catalogo-page">

            <div className="catalogo-wrapper">

                <div className="catalogo-header">
                    <h1>Catálogo completo</h1>
                    <p>{total} productos</p>
                </div>

                <div className="catalogo-layout">

                    <aside className="catalogo-sidebar">

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

                    <section className="catalogo-products">

                        {loading ? (
                            <p className="catalogo-loading">Cargando productos...</p>
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

                </div>

            </div>

        </div>
    );
};

export default Catalogo;
