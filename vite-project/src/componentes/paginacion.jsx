
import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { paginado } from "../redux/action";
import "./paginado.css"

const Paginado = () => {
    const dispatch = useDispatch()
    const currentPage = useSelector((state) => state.currentPage);
    const totalPages = useSelector((state) => state.totalPages);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);
    return (

        <div className="pagination-modern-wrapper fade-in">
            {/* PREV */}
            <button
                className="pagination-arrow"
                onClick={() => currentPage > 1 && dispatch(paginado("prev"))}
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
                        onClick={() => dispatch(paginado(i + 1))}
                        aria-label={`Ir a la página ${i + 1}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            {/* NEXT */}
            <button
                className="pagination-arrow"
                onClick={() => currentPage < totalPages && dispatch(paginado("next"))}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    )
}

export default Paginado