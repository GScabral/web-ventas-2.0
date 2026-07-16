import React, { useEffect, useState } from "react";
import { getResenasProducto, crearResena } from "../../../../redux/action";
import "../styles/reviews.css";

// Estrellas de solo lectura (para el promedio y cada reseña).
const Estrellas = ({ valor }) => (
  <span className="review-stars" aria-label={`${valor} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= Math.round(valor) ? "on" : ""}>★</span>
    ))}
  </span>
);

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return "";
  }
};

// Bloque de reseñas de la ficha de producto: resumen (promedio +
// cantidad), lista, y un formulario para dejar una reseña nueva (no
// requiere cuenta).
const ProductReviews = ({ productoId }) => {

  const [data, setData] = useState({ cantidad: 0, promedio: 0, resenas: [] });
  const [cargando, setCargando] = useState(true);

  const [form, setForm] = useState({ nombre: "", calificacion: 0, comentario: "" });
  const [hover, setHover] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargar = async () => {
    if (!productoId) return;
    try {
      const res = await getResenasProducto(productoId);
      setData(res);
    } catch {
      // Silencioso: si no cargan las reseñas, la ficha sigue funcionando.
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setCargando(true);
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!form.calificacion) {
      setError("Elegí una calificación (1 a 5 estrellas).");
      return;
    }

    setEnviando(true);
    try {
      await crearResena({
        producto_id: productoId,
        nombre: form.nombre.trim(),
        calificacion: form.calificacion,
        comentario: form.comentario.trim(),
      });
      setExito("¡Gracias por tu reseña!");
      setForm({ nombre: "", calificacion: 0, comentario: "" });
      cargar();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos guardar tu reseña. Probá de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="reviews">
      <h2 className="reviews-titulo">Opiniones</h2>

      <div className="reviews-resumen">
        {data.cantidad > 0 ? (
          <>
            <span className="reviews-promedio">{data.promedio.toFixed(1)}</span>
            <div>
              <Estrellas valor={data.promedio} />
              <span className="reviews-cantidad">
                {data.cantidad} {data.cantidad === 1 ? "opinión" : "opiniones"}
              </span>
            </div>
          </>
        ) : (
          !cargando && <p className="reviews-vacio">Todavía no hay opiniones. ¡Sé el primero!</p>
        )}
      </div>

      {/* Lista */}
      {data.resenas.length > 0 && (
        <ul className="reviews-lista">
          {data.resenas.map((r) => (
            <li key={r.id_resena} className="review-item">
              <div className="review-item-head">
                <span className="review-nombre">{r.nombre}</span>
                <Estrellas valor={r.calificacion} />
              </div>
              <p className="review-comentario">{r.comentario}</p>
              <span className="review-fecha">{formatearFecha(r.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Formulario */}
      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Dejá tu opinión</h3>

        {exito && <p className="review-exito">{exito}</p>}
        {error && <p className="review-error">{error}</p>}

        <div className="review-form-fila">
          <label>Tu calificación</label>
          <div className="review-stars-input" role="radiogroup" aria-label="Calificación">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={"star-btn" + ((hover || form.calificacion) >= n ? " on" : "")}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setForm((p) => ({ ...p, calificacion: n }))}
                aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="review-form-fila">
          <label>Tu nombre</label>
          <input
            type="text"
            required
            maxLength={80}
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
          />
        </div>

        <div className="review-form-fila">
          <label>Tu comentario</label>
          <textarea
            required
            rows="3"
            maxLength={1000}
            value={form.comentario}
            onChange={(e) => setForm((p) => ({ ...p, comentario: e.target.value }))}
          />
        </div>

        <button type="submit" className="review-submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Publicar opinión"}
        </button>
      </form>
    </section>
  );
};

export default ProductReviews;
