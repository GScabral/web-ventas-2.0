import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategorias } from "../../redux/action";
import "./categoriasSection.css";

// Tira de categorías para que el cliente entre directo al catálogo ya
// filtrado. El link va a "/?categoria=<nombre>" (no "/catalogo") porque
// es Home.jsx el que efectivamente lee ese query param y aplica el
// filtro (ver categoriaDesdeUrl en home.jsx) — Catalogo.jsx todavía no
// lee query params, así que un link ahí no filtraría nada.
const CategoriasSection = ({ contenido = {} }) => {

    const dispatch = useDispatch();

    const categorias = useSelector(state => state.categorias) || [];

    useEffect(() => {
        dispatch(getCategorias());
    }, [dispatch]);

    if (!categorias.length) return null;

    const titulo = contenido.titulo || "Comprá por categoría";

    return (
        <section className="categorias-section">

            <h2 className="categorias-section-titulo">{titulo}</h2>

            <div className="categorias-section-grid">

                {categorias.map(categoria => (
                    <Link
                        key={categoria.id_categoria}
                        to={`/?categoria=${encodeURIComponent(categoria.nombre)}`}
                        className="categoria-card"
                    >
                        <span>{categoria.nombre}</span>
                    </Link>
                ))}

            </div>

        </section>
    );
};

export default CategoriasSection;
