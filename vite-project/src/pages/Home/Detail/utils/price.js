export const calcularPrecioFinal = (precio, descuento) => {
    if (!descuento) return precio;
    return +(precio * (1 - descuento / 100)).toFixed(2);
};