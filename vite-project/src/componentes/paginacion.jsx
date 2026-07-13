
import React, { useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import "./paginado.css"

// Antes este componente leía/escribía currentPage y totalPages
// directamente de Redux (dispatch(paginado(...))), lo cual sólo tenía
// sentido cuando el catálogo completo ya estaba descargado y paginar
// era simplemente "mostrar otro slice del array en memoria". Ahora que
// el catálogo se pagina en el servidor (ver useCatalogo.js), cambiar de
// página implica pedir datos nuevos, así que el componente pasó a ser
// "tonto": recibe la página actual/total y avisa al padre qué página se
// quiere ver, sin saber de dónde salen los datos.
const Paginado = ({ currentPage, totalPages, onChange }) => {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    if (!totalPages || totalPages <= 1) return null;

    return (

        <div className="pagination-modern-wrapper fade-in">
            {/* PREV */}
            <button
                className="pagination-arrow"
                onClick={() => currentPage > 1 && onChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {/* NUMBERS */}
            <div className="pagination-glass">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`pagination-pill ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => onChange(i + 1)}
                        aria-label={`Ir a la página ${i + 1}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            {/* NEXT */}
            <button
                className="pagination-arrow"
                onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    )
}

export default Paginado
