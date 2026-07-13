import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCatalogo, getFacetas } from "../../redux/action";

const ITEMS_PER_PAGE = 12;

// Estado + fetch del catálogo público paginado/filtrado en el servidor.
// Usado por Catalogo.jsx (página "/catalogo") y CatalogoSection.jsx (la
// misma UI embebida como sección del Home) para no duplicar esta lógica
// dos veces.
//
// `categoriaInicial` permite arrancar con un filtro ya aplicado (por
// ejemplo, CatalogoSection.jsx llega con ?categoria=X desde un link).
const useCatalogo = (categoriaInicial = "") => {
  const dispatch = useDispatch();

  const catalogo = useSelector(
    (state) => state.catalogo || { productos: [], totalPages: 1, currentPage: 1, total: 0 }
  );

  const [loading, setLoading] = useState(true);

  const [categoria, setCategoria] = useState(categoriaInicial);
  const [subcategoria, setSubcategoria] = useState("");
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [precioMax, setPrecioMax] = useState(null);
  const [orden, setOrden] = useState("");
  const [page, setPage] = useState(1);

  // Facetas (tallas/colores/precio máximo disponibles): una sola vez.
  useEffect(() => {
    dispatch(getFacetas());
  }, [dispatch]);

  // Si cambia algún filtro u orden, hay que volver a la página 1 (una
  // página 5 con el filtro anterior puede no existir más con el nuevo).
  useEffect(() => {
    setPage(1);
  }, [categoria, subcategoria, tallas, colores, precioMax, orden]);

  // Si llega/cambia una categoría inicial desde afuera (link con
  // ?categoria=X), se aplica como si el usuario la hubiera clickeado.
  useEffect(() => {
    if (categoriaInicial) setCategoria(categoriaInicial);
  }, [categoriaInicial]);

  useEffect(() => {
    setLoading(true);

    dispatch(
      getCatalogo({
        page,
        limit: ITEMS_PER_PAGE,
        categoria,
        subcategoria,
        tallas,
        colores,
        precioMax,
        orden,
      })
    ).finally(() => setLoading(false));

  }, [dispatch, page, categoria, subcategoria, tallas, colores, precioMax, orden]);

  return {
    productos: catalogo.productos,
    total: catalogo.total,
    totalPages: catalogo.totalPages,
    currentPage: page,
    loading,

    categoria,
    setCategoria,
    subcategoria,
    setSubcategoria,
    tallas,
    setTallas,
    colores,
    setColores,
    precioMax,
    setPrecioMax,
    orden,
    setOrden,
    setPage,
  };
};

export default useCatalogo;
