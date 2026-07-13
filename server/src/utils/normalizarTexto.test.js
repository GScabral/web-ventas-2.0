const { describe, it, expect } = require("vitest");
const normalizarTexto = require("./normalizarTexto");

// Smoke test de una función chiquita pero con historial de bugs: el
// matching de ciudad/provincia para costo de envío depende 100% de que
// esto compare bien mayúsculas y acentos. Antes de este archivo, esta
// misma lógica estaba duplicada en dos controllers sin ningún test.
describe("normalizarTexto", () => {

  it("pasa todo a minúsculas", () => {
    expect(normalizarTexto("BUENOS AIRES")).toBe("buenos aires");
  });

  it("saca los acentos", () => {
    expect(normalizarTexto("Córdoba")).toBe("cordoba");
  });

  it("hace matchear variantes con y sin acento/mayúscula", () => {
    expect(normalizarTexto("Córdoba")).toBe(normalizarTexto("cordoba"));
    expect(normalizarTexto("CÓRDOBA")).toBe(normalizarTexto("córdoba"));
  });

  it("saca espacios de sobra en los extremos", () => {
    expect(normalizarTexto("  Rosario  ")).toBe("rosario");
  });

  it("no rompe con undefined/null/vacío", () => {
    expect(normalizarTexto(undefined)).toBe("");
    expect(normalizarTexto(null)).toBe("");
    expect(normalizarTexto("")).toBe("");
  });

});
