import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { agregarAlCarrito } from "../../../redux/action";

import { useProductDetail } from "./hooks/useProductDetail";
import { useProductOffer } from "./hooks/useProductOffer";
import { useProductVariants } from "./hooks/useProductVariants";
import { calcularPrecioFinal } from "./utils/price";

import ProductGallery from "./components/DetailGallery";
import ProductInfo from "./components/ProductInfo";
import BuyBox from "./components/BuyBox";
import RecommendedCarousel from "./components/RecommendedProducts";

import "./detail.css";

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { info, allProductos, ofertas } = useProductDetail(id);
  const oferta = useProductOffer(ofertas, info?.id);
  const { variantes, imagenesUnicas } = useProductVariants(info);

  const [talle, setTalle] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  const stock = useMemo(() => {
    const v = variantes.find(v => v.talla === talle && v.color === color);
    return v?.cantidad_disponible || 0;
  }, [talle, color, variantes]);

  const recomendados = useMemo(() => {
    return allProductos.filter(
      p => p.categoria === info?.categoria && p.id !== info?.id
    );
  }, [allProductos, info]);

  const handleAdd = () => {
    const variante = variantes.find(
      v => v.talla === talle && v.color === color
    );

    if (!variante) return;

    dispatch(agregarAlCarrito({
      id: info?.id,
      nombre: info?.nombre,
      precio: calcularPrecioFinal(info?.precio, oferta),
      cantidad,
      talla,
      color,
      idVariante: variante.idVariante,
      imagen: variante.imagenes?.[0]
    }));
  };

  return (
    <div className="detail-page">

      <div className="detail-grid">

        <ProductGallery
          images={imagenesUnicas}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
        />

        <div className="detail-side">

          <ProductInfo
            name={info?.nombre}
            description={info?.descripcion}
            price={calcularPrecioFinal(info?.precio, oferta)}
          />

          <BuyBox
            variantes={variantes}
            talle={talle}
            setTalle={setTalle}
            color={color}
            setColor={setColor}
            cantidad={cantidad}
            setCantidad={setCantidad}
            stock={stock}
            onAdd={handleAdd}
          />

          <Link className="back-link" to="/">
            ← Volver
          </Link>

        </div>
      </div>

      <RecommendedCarousel productos={recomendados} ofertas={ofertas} />

    </div>
  );
};

export default Detail;