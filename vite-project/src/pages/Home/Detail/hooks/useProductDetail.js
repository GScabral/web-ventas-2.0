import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getById, getProductos } from "../../../../redux/action";

export const useProductDetail = (id) => {
    const dispatch = useDispatch();

    const info = useSelector(state => state.info);

    // allProductosBackUp es la lista COMPLETA sin paginar (a diferencia
    // de allProductos, que solo tiene la página actual de la home).
    // Se necesita acá porque a una ficha de producto se puede llegar
    // directo (link compartido, recarga de página) sin haber pasado
    // antes por la home, y porque los recomendados no deberían
    // limitarse a los primeros 12 productos de la página 1.
    const allProductos = useSelector(state => state.allProductosBackUp);
    const ofertas = useSelector(state => state.ofertasActivas);

    useEffect(() => {
        if (id) dispatch(getById(id));
    }, [id, dispatch]);

    // Solo se pide si todavía no hay nada cargado, para no repetir el
    // fetch de más si el usuario ya pasó por la home antes.
    useEffect(() => {
        if (!allProductos?.length) dispatch(getProductos());
    }, [allProductos?.length, dispatch]);

    return {
        info,
        allProductos: allProductos || [],
        ofertas
    };
};