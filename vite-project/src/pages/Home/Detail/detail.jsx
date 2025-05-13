import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { agregarAlCarrito } from "../../../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './detail.css';

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const info = useSelector((state) => state.info);
  const allProductos = useSelector((state) => state.allProductos);
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [imagenActual, setImagenActual] = useState(0);
  const [showModal, setShowModal] = useState(false);


  const [oferta, setOferta] = useState(null)
  const ofertas = useSelector(state => state.ofertasActivas)

  console.log(info)



  useEffect(() => {
    const obtenerOfertaParaProducto = () => {
      // Buscar la oferta correspondiente al producto actual según su id
      const ofertaProducto = ofertas.find(oferta => oferta.producto_id === info.id);

      if (ofertaProducto) {
        setOferta(ofertaProducto.descuento); // Establecer la oferta del producto
      } else {
        setOferta(null); // No hay oferta para este producto
      }
    };

    obtenerOfertaParaProducto();
  }, [ofertas, info.id]);

  const calcularPrecioFinal = (precio, oferta) => {
    if (oferta) {
      const precioFinal = precio * (1 - oferta / 100);
      return precioFinal.toFixed(2); // Redondear a 2 decimales
    }
    return precio;
  };



  const variantesDisponibles = info.variantes;

  const handleTalleChange = (event) => {
    const talleSeleccionado = event.target.value;
    setTalleSeleccionado(talleSeleccionado);
    setColorSeleccionado('');

    // Filtrar las variantes por el talle seleccionado
    const variantesPorTalle = info.variantes.filter((variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase());

    // Obtener los colores disponibles para el talle seleccionado
    const coloresParaTalle = variantesPorTalle.map((variante) => variante.color);
    setColoresDisponibles(coloresParaTalle);

    // Obtener la cantidad disponible para el talle seleccionado
    const cantidadDisponible = variantesPorTalle.reduce((total, variante) => total + variante.cantidad_disponible, 0);
    setCantidadDisponible(cantidadDisponible);

    // Si el color seleccionado no está disponible para el talle seleccionado, reiniciar la cantidad
    if (!coloresParaTalle.includes(colorSeleccionado)) {
      setCantidad(1);
    }
  };

  const handleColorChange = (event) => {
    const colorSeleccionado = event.target.value;
    setColorSeleccionado(colorSeleccionado);

    // Obtener la variante correspondiente al talle y color seleccionados
    const varianteSeleccionada = info.variantes.find((variante) =>
      variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() &&
      variante.color === colorSeleccionado
    );

    // Actualizar la cantidad disponible según la variante seleccionada
    if (varianteSeleccionada) {
      setCantidadDisponible(varianteSeleccionada.cantidad_disponible);

      // Si la cantidad seleccionada excede la cantidad disponible, ajustarla
      if (cantidad > varianteSeleccionada.cantidad_disponible) {
        setCantidad(varianteSeleccionada.cantidad_disponible);
      }
    }
  };

  const handleCantidadChange = (event) => {
    let cantidad = parseInt(event.target.value);
    if (cantidad <= 0) {
      cantidad = 1; // Establecer la cantidad mínima como 1 si la cantidad ingresada es menor o igual a 0
    } else if (cantidad > cantidadDisponible) {
      cantidad = cantidadDisponible; // Establecer la cantidad máxima como la cantidad disponible
    }
    setCantidad(cantidad);
  };

  const handleImageChange = (index) => {
    setImagenActual(index);
  };

  const handleAgregarAlCarrito = () => {


    if (!talleSeleccionado || !colorSeleccionado) {
      alert('Por favor, selecciona un talle y un color antes de agregar al carrito.');
      return;
    }
    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );
    if (cantidad <= 0 || cantidad > info.cantidad) {
      alert('La cantidad seleccionada excede el stock disponible para este producto o es inválida.');
      return;
    }

    const variantes = [];
    const precioFinal = calcularPrecioFinal(info.precio, oferta);
    // Agregar la variante seleccionada al array de variantes
    variantes.push(varianteSeleccionada);
    const producto = {
      id,
      nombre: info.nombre,
      precio: precioFinal,
      descripcion: info.descripcion,
      cantidad_elegida: cantidad, // Incluye la cantidad seleccionada en el objeto del producto
      variantes: variantes,
    };
    dispatch(agregarAlCarrito(producto));
    setShowModal(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(getById(id));
    }
  }, [id, dispatch]);

  const productosRecomendados = allProductos.filter(producto => producto.categoria === info.categoria && producto.id !== info.id);


  return (
    <div className="detail-background">
      {info && (
        <div className="detail-container">
          <div className="detail-imagen-container">
            {info && info.variantes && info.variantes.length > 0 && (
              <div className="detail-imagen-container">
                <img
                  className="detail-imagen"
                  src={`http://localhost:3004/${info.variantes[imagenActual].imagenes[0]}`}
                  alt=""
                />
                <div className="imagen-buttons">
                  {info.variantes
                    .reduce((acc, variante) => {
                      variante.imagenes.forEach((imagen) => {
                        if (!acc.includes(imagen)) {
                          acc.push(imagen);
                        }
                      });
                      return acc;
                    }, [])
                    .map((imagen, index) => (
                      <button
                        key={index}
                        className={`imagen-button ${index === imagenActual ? 'active' : ''}`}
                        onClick={() => handleImageChange(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="detail-content">
            <p className="detail-title">{info.nombre}</p>
            <p className="detail-description">{info.descripcion}</p>
            <p className="detail-details">Precio: ${calcularPrecioFinal(info.precio, oferta)}</p>
            <div className="selecion-detail">
              <div className="selecion-content-detail">
                <label htmlFor="talle">Talle:</label>
                <select id="talle" value={talleSeleccionado} onChange={handleTalleChange}>
                  <option value="">Selecciona un talle</option>
                  {info.variantes &&
                    info.variantes.map((variante, index) => (
                      <option key={index} value={variante.talla}>
                        {variante.talla}
                      </option>
                    ))}
                </select>
                <label htmlFor="color">Color:</label>
                <select id="color" value={colorSeleccionado} onChange={handleColorChange}>
                  <option value="">Selecciona un color</option>
                  {coloresDisponibles.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  min="1"
                  max={cantidadDisponible}
                  onChange={handleCantidadChange}
                />
                <button onClick={handleAgregarAlCarrito}>Agregar al Carrito</button>
              </div>
            </div>
          </div>
          <Link className="volver" to={"/"}>
            Volver
          </Link>
        </div>
      )}
      <h1 className="recomendaciones">OTRAS OPCIONES QUE PODRIAN GUSTARTE</h1>
      <div className="recomendaciones-container">
        {productosRecomendados.map(producto => {
          // Buscar la oferta correspondiente al producto recomendado
          const ofertaProducto = ofertas.find(oferta => oferta.producto_id === producto.id);
          const descuento = ofertaProducto ? ofertaProducto.descuento : null;

          return (
            <Link key={producto.id} to={`/detail/${producto.id}`}>
              <div className="recomendacion-item">
                <img src={`http://localhost:3004/${producto.variantes[0].imagenes[0]}`} alt={producto.nombre} />
                <p className="recomendados-p">{producto.nombre}</p>
                {descuento ? ( // Mostrar el porcentaje de oferta y el precio final solo si hay oferta
                  <div>
                    <p>{descuento}% OFF</p>
                    <h3 className="card-precio">
                      <span style={{ textDecoration: 'line-through' }}>
                        ${producto.precio}
                      </span>
                      <span style={{ marginLeft: '10px' }}>
                        ${calcularPrecioFinal(producto.precio, descuento)}
                      </span>
                    </h3>
                  </div>
                ) : (
                  <h3 className="card-precio">
                    ${producto.precio}
                  </h3>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div >
  );

};

export default Detail;
