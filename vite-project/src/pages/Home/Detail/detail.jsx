import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { agregarAlCarrito, mostrarToast } from "../../../redux/action";

import { useProductDetail } from "./hooks/useProductDetail";
import { useProductOffer } from "./hooks/useProductOffer";
import { useProductVariants } from "./hooks/useProductVariants";
import { calcularPrecioFinal } from "./utils/price";
import { validarStock } from "./utils/stock";
import useMetaTags from "../../../componentes/hooks/useMetaTags";

import ProductGallery from "./components/DetailGallery";
import ProductInfo from "./components/ProductInfo";
import BuyBox from "./components/BuyBox";
import RecommendedCarousel from "./components/RecommendedProducts";
import ProductReviews from "./components/ProductReviews";

import "./detail.css";

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { info, allProductos, ofertas } = useProductDetail(id);
  const oferta = useProductOffer(ofertas, info?.id);
  const { variantes, imagenesUnicas } = useProductVariants(info);

  // Antes toda ficha de producto compartía el mismo <title>/og:image del
  // resto del sitio — un link a "Campera Denim Oversize" y uno a "Home"
  // se veían idénticos al compartirlos. Se actualiza recién cuando
  // `info` termina de cargar (useMetaTags cae al nombre de la tienda
  // mientras tanto).
  useMetaTags({
    title: info?.nombre,
    description: info?.descripcion,
    image: imagenesUnicas?.[0],
    type: "product",
  });

  const [talle, setTalle] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [stockError, setStockError] = useState("");

  const stock = useMemo(() => {
    const v = variantes.find(v => v.talla === talle && v.color === color);
    return v?.cantidad_disponible || 0;
  }, [talle, color, variantes]);

  // Si el cliente cambia el talle, el color o la cantidad después de
  // ver el error, lo limpiamos para no dejar un mensaje viejo pegado.
  useEffect(() => {
    setStockError("");
  }, [talle, color, cantidad]);

  const recomendados = useMemo(() => {
    return allProductos.filter(
      p => p.categoria?.id === info?.categoria?.id && p.id !== info?.id
    );
  }, [allProductos, info]);

  const handleAdd = () => {

    // Misma lógica de antes, ahora extraída a utils/stock.js (ver
    // comentario ahí) para poder testearla sin montar todo el
    // componente.
    const resultado = validarStock({ talle, color, cantidad, variantes });

    if (!resultado.ok) {
      setStockError(resultado.error);
      return;
    }

    const { variante } = resultado;

    setStockError("");

    dispatch(agregarAlCarrito({
      id: info?.id,
      nombre: info?.nombre,
      precio: calcularPrecioFinal(info?.precio, oferta),
      cantidad,
      // Se manda con los dos nombres a propósito: CartItem.jsx lo
      // muestra como "talla", y useCheckout.js / el backend lo leen
      // como "talle". Mandar ambos evita que el talle se pierda en
      // alguno de los dos pasos por una diferencia de nombre.
      talla: talle,
      talle,
      color,
      idVariante: variante.idVariante,
      imagen: variante.imagenes?.[0]
    }));

    dispatch(mostrarToast(`${info?.nombre} se agregó al carrito`));
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
            stockError={stockError}
            onAdd={handleAdd}
          />

          <Link className="back-link" to="/">
            ← Volver
          </Link>

        </div>
      </div>

      {info?.id && <ProductReviews productoId={info.id} />}

      <RecommendedCarousel productos={recomendados} ofertas={ofertas} />

    </div>
  );
};

export default Detail;