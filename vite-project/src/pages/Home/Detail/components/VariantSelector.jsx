import React from "react";
import "../styles/variants.css";

const VariantPicker = ({
  talles,
  colores,
  talle,
  color,
  setTalle,
  setColor
}) => {
  return (
    <div className="variants">

      <div>
        <span>Talle</span>
        <div className="chips">
          {talles.map(t => (
            <button
              key={t}
              className={t === talle ? "chip active" : "chip"}
              onClick={() => setTalle(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span>Color</span>
        <div className="chips">
          {colores.map(c => (
            <button
              key={c}
              className={c === color ? "chip active" : "chip"}
              onClick={() => setColor(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VariantPicker;