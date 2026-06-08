import { useMemo } from "react";

export const useProductVariants = (info) => {
    const variantes = info?.variantes || [];

    const imagenesUnicas = useMemo(() => {
        const set = new Set();
        variantes.forEach(v =>
            v.imagenes?.forEach(img => set.add(img))
        );
        return [...set];
    }, [variantes]);

    const talles = useMemo(() => {
        return [...new Set(variantes.map(v => v.talla))];
    }, [variantes]);

    return {
        variantes,
        imagenesUnicas,
        talles
    };
};