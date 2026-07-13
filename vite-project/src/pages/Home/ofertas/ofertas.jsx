import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProductos, getOfertas } from "../../../redux/action";
import ProductGrid from "../Cards/productGrid";
import useMetaTags from "../../../componentes/hooks/useMetaTags";

import "./ofertas.css";

// Página pública de ofertas: lista solo los productos que tienen una
// oferta VIGENTE hoy (no vencida, no programada a futuro). Antes este
// archivo estaba comentado por completo y usaba un import roto
// ("../Cards/Cards", que no existe) — se reescribe con el mismo patrón
// que ya usa Catalogo.jsx (ProductGrid + Card.jsx, que ya sabe pintar
// el badge de descuento solo).
const Ofertas = () => {
  const dispatch = useDispatch();

  useMetaTags({
    title: "Ofertas",
    description: "Productos con descuento por tiempo limitado.",
  });

  const productos = useSelector(state => state.allProductosforFiltro) || [];
  const ofertas = useSelector(state => state.ofertasActivas) || [];

  useEffect(() => {
    dispatch(getProductos());
    dispatch(getOfertas());
  }, [dispatch]);

  const cargando = !productos.length && !ofertas.length;

  const ahora = new Date();

  // state.ofertasActivas trae también vencidas/futuras a propósito
  // (el admin las necesita para poder borrarlas — ver getOferta.js),
  // así que acá se filtra por fecha antes de decidir qué productos
  // mostrar, igual que en Card.jsx y useProductOffer.js.
  const productosConOferta = productos.filter(producto =>
    ofertas.some(oferta =>
      Number(oferta.producto_id) === Number(producto.id) &&
      new Date(oferta.inicio) <= ahora &&
      new Date(oferta.fin) >= ahora
    )
  );

  return (
    <div className="ofertas-page">

      <h1 className="ofertas-title">Ofertas actuales</h1>

      {cargando ? (
        <p className="ofertas-loading">Cargando ofertas...</p>
      ) : productosConOferta.length === 0 ? (
        <div className="admin-empty-state">
          No hay ofertas activas en este momento.
        </div>
      ) : (
        <ProductGrid productos={productosConOferta} />
      )}

    </div>
  );
};

export default Ofertas;
