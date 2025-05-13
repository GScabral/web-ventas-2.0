import React, { useState, useEffect } from 'react';
import './card.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { agregarFav, agregarAlCarrito, getOfertas } from '../../../redux/action';

const Card = ({ id, nombre, descripcion, categoria, precio, imagenes, variantes }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadMaxima, setCantidadMaxima] = useState(false);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [confirmacionCarrito, setConfirmacionCarrito] = useState(false);
  const [confirmacionFav, setConfirmacionFav] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const variantesDisponibles = variantes || [];

  const [oferta, setOferta] = useState(null)
  const ofertas = useSelector(state => state.ofertasActivas)

  useEffect(() => {
    dispatch(getOfertas()); // Despachar la acción para obtener las ofertas activas
  }, [dispatch]);
  // console.log("ofertas:",ofertas)

  // Función para obtener la oferta del producto actual
  useEffect(() => {
    const obtenerOfertaParaProducto = () => {
      // Buscar la oferta correspondiente al producto actual según su id
      const ofertaProducto = ofertas.find(oferta => oferta.producto_id === id);

      if (ofertaProducto) {
        setOferta(ofertaProducto.descuento); // Establecer la oferta del producto
      } else {
        setOferta(null); // No hay oferta para este producto
      }
    };

    obtenerOfertaParaProducto();
  }, [ofertas, id]);

  // Función para calcular el precio final considerando la oferta
  const calcularPrecioFinal = (precio, oferta) => {
    if (oferta) {
      const precioFinal = precio * (1 - oferta / 100);
      return precioFinal.toFixed(2); // Redondear a 2 decimales
    }
    return precio;
  };


  const handleAgregarAlCarritoLocal = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      alert('Por favor, selecciona un talle y un color antes de agregar al carrito.');
      return;
    }

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (!varianteSeleccionada) {
      alert('No se encontró una variante disponible con el talle y color seleccionados.');
      return;
    }

    const precioFinal = calcularPrecioFinal(precio, oferta);

    const producto = {
      id,
      nombre,
      precio: precioFinal,
      descripcion,
      cantidad_elegida: cantidad, // Incluye la cantidad seleccionada en el objeto del producto
      variantes: [
        {
          idVariante: varianteSeleccionada.idVariante,
          talla: talleSeleccionado,
          color: colorSeleccionado,
          cantidad_disponible: varianteSeleccionada.cantidad_disponible,
          imagenes: varianteSeleccionada.imagenes, // Usar las imágenes de la variante seleccionada
        }
      ],
    };

    dispatch(agregarAlCarrito(producto));
    setConfirmacionCarrito(true);
    setTimeout(() => setConfirmacionCarrito(false), 3000);
  };


  const handleTalleChange = (e) => {
    const talleSeleccionado = e.target.value;
    setTalleSeleccionado(talleSeleccionado); // Actualizar el estado del talle seleccionado
    setColorSeleccionado('');

    const coloresParaTalle = variantesDisponibles
      .filter((variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase())
      .map((variante) => variante.color);

    setColoresDisponibles(coloresParaTalle);

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;
      setCantidad(cantidadDisponible > 0 ? Math.max(1, Math.min(cantidad, cantidadDisponible)) : 0);
      setBotonHabilitado(cantidadDisponible > 0);
    }
  };

  const handleColorChange = (e) => {
    const colorSeleccionado = e.target.value;
    setColorSeleccionado(colorSeleccionado);

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;
      setCantidad(cantidadDisponible > 0 ? Math.max(1, Math.min(cantidad, cantidadDisponible)) : 0);
      setBotonHabilitado(cantidadDisponible > 0);
    }
  };

  const incrementarCantidad = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      console.error('Error: Talle o color no definidos.');
      return;
    }

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;

      if (cantidad < cantidadDisponible) {
        const nuevaCantidad = cantidad + 1;
        setCantidad(nuevaCantidad);
        setBotonHabilitado(true);
      } else {
        setCantidadMaxima(true);
        setTimeout(() => {
          setCantidadMaxima(false);
          setBotonHabilitado(false);
        }, 3000);
      }
    }
  };

  const decrementarCantidad = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      console.error('Error: Talle o color no definidos.');
      return;
    }

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada && cantidad > 1) {
      const nuevaCantidad = cantidad - 1;
      setCantidad(nuevaCantidad);
      setBotonHabilitado(true);
    } else {
      console.log('La cantidad mínima es 1');
    }
  };

  useEffect(() => {
    setColorSeleccionado('');
  }, [talleSeleccionado]);

  const tallesDisponibles = [...new Set(variantesDisponibles.map((variante) => variante.talla))];

  return (
    <>
      {showModal && (

        <div className="modal-card">
          <span className="close" onClick={() => setShowModal(false)}>
            &times;
          </span>
          <div className="modal-content-card">
            <h2>Agregar al Carrito</h2>
            <label htmlFor="talle" className="label-card">Talle:</label>
            <select
              id="talle"
              value={talleSeleccionado}
              onChange={handleTalleChange}
              className="select-card"
            >
              <option value="">Selecciona un talle</option>
              {tallesDisponibles.map((talle, idx) => (
                <option key={`talle-${idx}`} value={talle}>
                  {talle}
                </option>
              ))}
            </select>
            <label htmlFor="color" className="label-card">Color:</label>
            <select
              id="color"
              value={colorSeleccionado}
              onChange={handleColorChange}
              className="select-card"
            >
              <option value="">Selecciona un color</option>
              {coloresDisponibles.map((color, idx) => (
                <option key={`color-${idx}`} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <button onClick={incrementarCantidad} className="button-card" disabled={!botonHabilitado}>
              +
            </button>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              className="input-card"
              onChange={(e) => {
                const nuevaCantidad = parseInt(e.target.value, 10) || 1;
                if (nuevaCantidad <= cantidadMaxima) {
                  setCantidad(nuevaCantidad);
                }
              }}
            />
            <button onClick={decrementarCantidad} className="button-card">
              -
            </button>
            <button onClick={handleAgregarAlCarritoLocal} className="button-card" disabled={!botonHabilitado}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      )}
      <div className="card-container">
        {confirmacionCarrito && <div className="confirmation-message animacion-text">¡Producto agregado al carrito!</div>}
        {confirmacionFav && <div className="confirmation-message">¡Producto agregado a favoritos!</div>}

        <Link to={`/detail/${id}`} className="card-link">
          <div className="card-content">
            <img className="card-imagen" src={`http://localhost:3004/${variantes && variantes[0] && variantes[0].imagenes && variantes[0].imagenes[0]}`} />
            <span className="card-categoria">{categoria}</span>
            <p className="card-inf">{descripcion}</p>
            {oferta > 0 ? ( // Mostrar el porcentaje de oferta y el precio final solo si hay oferta
              <div>
                <p>{oferta}% OFF</p>
                <h3 className="card-precio">
                  <span style={{ textDecoration: 'line-through' }}>
                    ${precio}
                  </span>
                  <span style={{ marginLeft: '10px' }}>
                    ${calcularPrecioFinal(precio, oferta)}
                  </span>
                </h3>
              </div>
            ) : (
              <h3 className="card-precio">
                ${precio}
              </h3>
            )}
          </div>
        </Link>
        <div className="card-buttons">
          <button className="card-detail" onClick={() => setShowModal(true)}>
            añadir al carrito
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
