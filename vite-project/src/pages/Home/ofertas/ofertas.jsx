import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cards from "../Cards/Cards";
import { getProductos, getOfertas } from "../../../redux/action";
import "./ofertas.css";

const Ofertas = () => {
  const dispatch = useDispatch();
  const productos = useSelector(state => state.allProductosforFiltro);
  const ofertas   = useSelector(state => state.ofertasActivas);

  useEffect(() => {
    dispatch(getProductos());
    dispatch(getOfertas());
  }, [dispatch]);

  if (!productos.length || !ofertas.length) {
    return <p className="ofertas-loading">Cargando ofertas...</p>;
  }

  const productosConOfertas = productos.filter(producto => {
    return ofertas.some(oferta => {
      const hoy = new Date();
      return (
        Number(oferta.producto_id) === Number(producto.id) &&
        hoy >= new Date(oferta.inicio) &&
        hoy <= new Date(oferta.fin)
      );
    });
  });

  return (
    <div>
      <h1>OFERTAS ACTUALES</h1>
      <div className="ofertas-container">
        {productosConOfertas.map(p => {
          const oferta = ofertas.find(o => Number(o.producto_id) === Number(p.id));
          const precioFinal = oferta
            ? (p.precio * (1 - oferta.descuento / 100)).toFixed(2)
            : p.precio;
          return (
            <Cards
              key={p.id}
              {...p}
              oferta={oferta?.descuento || 0}
              precioFinal={precioFinal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Ofertas;
