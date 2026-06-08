import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getById } from "../../../../redux/action";

export const useProductDetail = (id) => {
    const dispatch = useDispatch();

    const info = useSelector(state => state.info);
    const allProductos = useSelector(state => state.allProductos);
    const ofertas = useSelector(state => state.ofertasActivas);

    useEffect(() => {
        if (id) dispatch(getById(id));
    }, [id, dispatch]);

    return {
        info,
        allProductos,
        ofertas
    };
};