const { Cupon } = require("../../db");

// Se usa en DOS lugares: el endpoint público que valida el cupón
// mientras el cliente lo escribe en el checkout (antes de confirmar),
// y la creación real del pedido (que vuelve a validar todo del lado
// del servidor, nunca confía en el descuento que mande el navegador).
// Que ambos usen esta misma función evita que quede una regla de
// validación en un lugar y otra distinta en el otro.
const validarCupon = async (codigo, subtotal, opciones = {}) => {

    if (!codigo) {
        return { valido: false, motivo: "Ingresá un código de cupón." };
    }

    const codigoNormalizado = codigo.trim().toUpperCase();

    const findOptions = { where: { codigo: codigoNormalizado } };

    // Si viene una transacción, bloqueamos la fila del cupón hasta que
    // termine la operación — evita que dos compras casi simultáneas
    // usando el mismo cupón limitado pasen ambas la validación de
    // "usos_maximos" antes de que ninguna haya incrementado el
    // contador todavía.
    if (opciones.transaction) {
        findOptions.transaction = opciones.transaction;
        findOptions.lock = opciones.transaction.LOCK.UPDATE;
    }

    const cupon = await Cupon.findOne(findOptions);

    if (!cupon) {
        return { valido: false, motivo: "Ese cupón no existe." };
    }

    if (!cupon.activo) {
        return { valido: false, motivo: "Ese cupón ya no está activo." };
    }

    const ahora = new Date();

    if (cupon.fecha_inicio && ahora < new Date(cupon.fecha_inicio)) {
        return { valido: false, motivo: "Ese cupón todavía no está vigente." };
    }

    if (cupon.fecha_fin && ahora > new Date(cupon.fecha_fin)) {
        return { valido: false, motivo: "Ese cupón ya venció." };
    }

    if (cupon.usos_maximos !== null && cupon.usos_actuales >= cupon.usos_maximos) {
        return { valido: false, motivo: "Ese cupón alcanzó el límite de usos." };
    }

    if (cupon.monto_minimo && subtotal < cupon.monto_minimo) {
        return {
            valido: false,
            motivo: `Este cupón requiere una compra mínima de $${cupon.monto_minimo.toLocaleString("es-AR")}.`,
        };
    }

    const descuento = cupon.tipo === "porcentaje"
        ? (subtotal * cupon.valor) / 100
        : Math.min(cupon.valor, subtotal); // nunca descuenta más que el propio subtotal

    return {
        valido: true,
        cupon,
        descuento: Math.round(descuento * 100) / 100,
    };
};

module.exports = validarCupon;
