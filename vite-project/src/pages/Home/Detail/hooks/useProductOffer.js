import { useMemo } from "react";

export const useProductOffer = (ofertas, productId) => {
    return useMemo(() => {
        return ofertas.find(o => o.producto_id === productId)?.descuento || null;
    }, [ofertas, productId]);
};