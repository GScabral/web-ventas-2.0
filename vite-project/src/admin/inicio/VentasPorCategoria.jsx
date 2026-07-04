import React from "react";

// Ranking simple de categorías por monto vendido — barras hechas con
// CSS (ancho proporcional al total de la más vendida), no hace falta
// una librería de gráficos para esto.
const VentasPorCategoria = ({ ventasPorCategoria = [] }) => {

    if (!ventasPorCategoria.length) {
        return (
            <div className="categorias-chart">
                <span className="categorias-chart-titulo">Ventas por categoría</span>
                <p className="categorias-chart-vacio">
                    Todavía no hay ventas en este período.
                </p>
            </div>
        );
    }

    const maximo = Math.max(...ventasPorCategoria.map(c => c.total));

    // Mostramos como mucho el top 6, para que no se haga interminable
    // si hay muchas categorías cargadas.
    const top = ventasPorCategoria.slice(0, 6);

    return (
        <div className="categorias-chart">

            <span className="categorias-chart-titulo">Ventas por categoría</span>

            <div className="categorias-chart-lista">
                {top.map((cat) => (
                    <div key={cat.categoria} className="categoria-fila">

                        <div className="categoria-fila-header">
                            <span className="categoria-nombre">{cat.categoria}</span>
                            <span className="categoria-monto">
                                ${cat.total.toLocaleString("es-AR")}
                            </span>
                        </div>

                        <div className="categoria-barra-fondo">
                            <div
                                className="categoria-barra-relleno"
                                style={{ width: `${(cat.total / maximo) * 100}%` }}
                            />
                        </div>

                        <span className="categoria-cantidad">
                            {cat.cantidad} unidad{cat.cantidad === 1 ? "" : "es"} vendida{cat.cantidad === 1 ? "" : "s"}
                        </span>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default VentasPorCategoria;
