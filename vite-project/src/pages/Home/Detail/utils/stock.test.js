import { describe, it, expect } from "vitest";
import { validarStock } from "./stock";

const variantes = [
  { talla: "M", color: "Negro", cantidad_disponible: 3, idVariante: 1 },
  { talla: "M", color: "Blanco", cantidad_disponible: 0, idVariante: 2 },
];

// Smoke tests del punto más sensible del flujo de compra: que no se
// pueda agregar al carrito algo que en realidad no hay. Un bug acá
// significa venderle a alguien algo que después no se le puede
// entregar.
describe("validarStock", () => {

  it("pide talle si no hay uno elegido", () => {
    const r = validarStock({ talle: "", color: "Negro", cantidad: 1, variantes });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Seleccioná un talle.");
  });

  it("pide color si no hay uno elegido", () => {
    const r = validarStock({ talle: "M", color: "", cantidad: 1, variantes });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Seleccioná un color.");
  });

  it("rechaza una combinación de talle/color que no existe", () => {
    const r = validarStock({ talle: "L", color: "Negro", cantidad: 1, variantes });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Esa combinación de talle y color no está disponible.");
  });

  it("rechaza pedir más cantidad de la disponible", () => {
    const r = validarStock({ talle: "M", color: "Negro", cantidad: 5, variantes });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Solo quedan 3 unidades disponibles.");
  });

  it("rechaza una variante con stock 0, aunque exista", () => {
    const r = validarStock({ talle: "M", color: "Blanco", cantidad: 1, variantes });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Solo quedan 0 unidades disponibles.");
  });

  it("acepta una combinación válida dentro del stock", () => {
    const r = validarStock({ talle: "M", color: "Negro", cantidad: 2, variantes });
    expect(r.ok).toBe(true);
    expect(r.error).toBe(null);
    expect(r.variante.idVariante).toBe(1);
  });

});
