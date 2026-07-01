import React, { useState } from "react";

// Gráfico de barras hecho a mano con SVG, sin librerías externas —
// para algo tan simple (una serie de 7-30 puntos) no vale la pena
// sumar una dependencia nueva al proyecto.
const VentasChart = ({ ventasPorDia = [] }) => {

    const [rango, setRango] = useState(7);

    const datos = ventasPorDia.slice(-rango);

    const maximo = Math.max(1, ...datos.map(d => d.total));

    const ANCHO = 640;
    const ALTO = 160;
    const gap = rango === 7 ? 10 : 3;
    const anchoBarra = (ANCHO - gap * (datos.length - 1)) / datos.length;

    const formatearFecha = (fechaISO) => {
        const [, mes, dia] = fechaISO.split("-");
        return `${dia}/${mes}`;
    };

    return (
        <div className="ventas-chart">

            <div className="ventas-chart-header">
                <span className="ventas-chart-titulo">Ventas por día</span>

                <div className="ventas-chart-toggle">
                    <button
                        type="button"
                        className={rango === 7 ? "activo" : ""}
                        onClick={() => setRango(7)}
                    >
                        7 días
                    </button>
                    <button
                        type="button"
                        className={rango === 30 ? "activo" : ""}
                        onClick={() => setRango(30)}
                    >
                        30 días
                    </button>
                </div>
            </div>

            {datos.every(d => d.total === 0) ? (
                <div className="ventas-chart-vacio">
                    Todavía no hay ventas en este período.
                </div>
            ) : (
                <svg
                    viewBox={`0 0 ${ANCHO} ${ALTO + 24}`}
                    className="ventas-chart-svg"
                    role="img"
                    aria-label="Gráfico de ventas por día"
                >
                    {datos.map((dia, i) => {
                        const alturaBarra = (dia.total / maximo) * ALTO;
                        const x = i * (anchoBarra + gap);
                        const y = ALTO - alturaBarra;

                        return (
                            <g key={dia.fecha}>
                                <title>
                                    {formatearFecha(dia.fecha)}: ${dia.total.toLocaleString("es-AR")}
                                </title>
                                <rect
                                    x={x}
                                    y={y}
                                    width={anchoBarra}
                                    height={Math.max(alturaBarra, dia.total > 0 ? 2 : 0)}
                                    rx="3"
                                    fill="var(--accent-terracota)"
                                    opacity={dia.total > 0 ? 1 : 0.15}
                                />
                                {rango === 7 && (
                                    <text
                                        x={x + anchoBarra / 2}
                                        y={ALTO + 16}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="var(--text-muted)"
                                    >
                                        {formatearFecha(dia.fecha)}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            )}

        </div>
    );
};

export default VentasChart;
