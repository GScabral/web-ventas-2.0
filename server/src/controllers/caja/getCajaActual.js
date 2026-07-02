const { CajaSesion, CajaMovimiento } = require("../../db");

const getCajaActual = async (req, res) => {
    try {

        const sesion = await CajaSesion.findOne({
            where: { estado: "abierta" },
            include: [{ model: CajaMovimiento }],
            order: [["fecha_apertura", "DESC"]],
        });

        if (!sesion) {
            return res.status(200).json(null);
        }

        const movimientos = sesion.CajaMovimientos || [];

        // Separamos por método de pago: solo lo cobrado/pagado en
        // EFECTIVO afecta lo que debería haber físicamente en el
        // cajón. Una venta por transferencia o Mercado Pago es una
        // venta real del día, pero ese dinero nunca pasó por el
        // cajón, así que no puede formar parte del "saldo esperado"
        // que se cuenta al cerrar caja.
        const esEfectivo = (m) => m.metodo_pago === "efectivo";

        const totalIngresosEfectivo = movimientos
            .filter(m => m.tipo === "ingreso" && esEfectivo(m))
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const totalEgresosEfectivo = movimientos
            .filter(m => m.tipo === "egreso" && esEfectivo(m))
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const totalIngresosOtros = movimientos
            .filter(m => m.tipo === "ingreso" && !esEfectivo(m))
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const totalEgresosOtros = movimientos
            .filter(m => m.tipo === "egreso" && !esEfectivo(m))
            .reduce((acc, m) => acc + Number(m.monto), 0);

        // Saldo esperado en el CAJÓN (solo efectivo).
        const saldoActual = Number(sesion.monto_inicial) + totalIngresosEfectivo - totalEgresosEfectivo;

        // Ventas totales del día sin importar el método (informativo,
        // no se usa para el arqueo del cajón).
        const totalIngresos = totalIngresosEfectivo + totalIngresosOtros;
        const totalEgresos = totalEgresosEfectivo + totalEgresosOtros;

        res.status(200).json({
            ...sesion.toJSON(),
            movimientos: [...movimientos].sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            ),
            totalIngresos,
            totalEgresos,
            totalIngresosEfectivo,
            totalEgresosEfectivo,
            totalIngresosOtros,
            totalEgresosOtros,
            saldoActual,
        });

    } catch (error) {
        console.error("Error al obtener la caja actual:", error);
        res.status(500).json({ error: "No pudimos obtener la caja." });
    }
};

module.exports = getCajaActual;
