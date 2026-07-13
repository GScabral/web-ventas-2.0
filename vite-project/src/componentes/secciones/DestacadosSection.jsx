import React from "react";
import { useSelector } from "react-redux";
import TrendingSection from "../TrendingSection";

// Conecta el componente TrendingSection (que ya existía pero estaba
// huérfano, sin nada que lo renderizara) a los productos reales. Filtra
// por la sección elegida en el editor de Diseño (por defecto,
// "destacados" — la misma que ya se puede asignar a un producto desde
// "Editar producto" → "Mostrar producto en"). Mismo criterio de
// filtrado client-side que usa hero.jsx para su sección "hero".
const DestacadosSection = ({ contenido = {} }) => {

    const productos = useSelector(state => state.allProductos) || [];

    const seccionSlug = contenido.seccionSlug || "destacados";

    const productosDestacados = productos.filter(producto =>
        producto.sections?.some(s => s.section === seccionSlug)
    );

    return (
        <TrendingSection
            productos={productosDestacados}
            eyebrow={contenido.eyebrow}
            titulo={contenido.titulo}
            cantidad={contenido.cantidad || 5}
        />
    );
};

export default DestacadosSection;
