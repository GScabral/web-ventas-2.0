import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { eliminarFav } from "../../../redux/action";
import Cards from "../Cards/Cards";
import "./fav.css"

const Fav = () => {
  const favoritos = useSelector((state) => state.fav);
  const dispatch = useDispatch();

  const eliminarDeFavoritos = (id) => {
    dispatch(eliminarFav(id)); // Despachar la acción para eliminar el elemento de favoritos
  };

  return (
    <div className="favorito">
      <h2>PRENDAS QUE TE GUSTARON</h2>
      {favoritos.length === 0 ? ( // Verificar si la lista de favoritos está vacía
        <p>No hay productos agregados a favoritos.</p>
      ) : (
        <div className="lista-Fav">
          {favoritos.map((producto, index) => (
            <div key={index} className="fav-card">
              <Cards producto={producto} />
              <button onClick={() => eliminarDeFavoritos(index)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      <Link to="/">
        <button>volver a la home</button>
      </Link>
    </div>
  );
};

export default Fav;
