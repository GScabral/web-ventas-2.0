import Card from "../Card/Card";
import './cards.css';

const Cards = ({ productos, agregarAlCarrito, agregarFav }) => {
    if (!Array.isArray(productos)) {
        return <div className="cards-container">Cargando productos...</div>;
    }

    return (
        <div className="cards-container">
            {productos.map((producto) => (
                <Card
                    key={producto.id}
                    id={producto.id}
                    nombre={producto.nombre}
                    imagenes={producto.imagenes}
                    categoria={producto.categoria}
                    talles={producto.talles}
                    precio={producto.precio}
                    descripcion={producto.descripcion}
                    colores={producto.colores}
                    variantes={producto.variantes}
                    agregarAlCarrito={agregarAlCarrito}
                    agregarFav={agregarFav}
                />
            ))}
        </div>
    );
};

export default Cards;
