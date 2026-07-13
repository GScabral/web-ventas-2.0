// Extraído de detail.jsx (handleAdd) para poder testearlo sin tener que
// montar todo el componente. Misma lógica y mismos mensajes exactos que
// antes: sólo se movió el "qué" de adentro del componente a una función
// pura, no se cambió el comportamiento.
export const validarStock = ({ talle, color, cantidad, variantes = [] }) => {

  if (!talle) {
    return { ok: false, error: "Seleccioná un talle.", variante: null };
  }

  if (!color) {
    return { ok: false, error: "Seleccioná un color.", variante: null };
  }

  const variante = variantes.find(
    (v) => v.talla === talle && v.color === color
  );

  if (!variante) {
    return {
      ok: false,
      error: "Esa combinación de talle y color no está disponible.",
      variante: null,
    };
  }

  if (cantidad > variante.cantidad_disponible) {
    return {
      ok: false,
      error: `Solo quedan ${variante.cantidad_disponible} unidades disponibles.`,
      variante,
    };
  }

  return { ok: true, error: null, variante };
};
