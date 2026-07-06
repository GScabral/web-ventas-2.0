import { useMemo } from "react";

export const useProductOffer = (ofertas, productId) => {
    return useMemo(() => {
        // Mismo fix que en Card.jsx: "ofertas" trae también vencidas y
        // futuras a propósito (el admin las necesita para poder
        // borrarlas), así que acá hay que filtrar por fecha antes de
        // aplicar el descuento — si no, el detalle del producto podía
        // mostrar un precio rebajado de una oferta que ya terminó.
        const ahora = new Date();

        const ofertaVigente = ofertas.find(o =>
            o.producto_id === productId &&
            new Date(o.inicio) <= ahora &&
            new Date(o.fin) >= ahora
        );

        return ofertaVigente?.descuento || null;
    }, [ofertas, productId]);
};