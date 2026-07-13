import { describe, it, expect } from "vitest";
import { calcularPrecioFinal } from "./price";

describe("calcularPrecioFinal", () => {

  it("sin descuento devuelve el precio tal cual", () => {
    expect(calcularPrecioFinal(1000, null)).toBe(1000);
    expect(calcularPrecioFinal(1000, 0)).toBe(1000);
    expect(calcularPrecioFinal(1000, undefined)).toBe(1000);
  });

  it("aplica el porcentaje de descuento", () => {
    expect(calcularPrecioFinal(1000, 10)).toBe(900);
    expect(calcularPrecioFinal(2000, 50)).toBe(1000);
  });

  it("redondea a 2 decimales", () => {
    expect(calcularPrecioFinal(999, 33)).toBe(669.33);
  });

});
