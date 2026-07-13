const { Op } = require("sequelize");
const {
  Productos,
  variantesproductos,
  Categorias,
  sections
} = require("../../db");

const ITEMS_PER_PAGE_DEFAULT = 12;

// Trae el catálogo público paginado y filtrado en el servidor (en vez de
// descargar TODOS los productos y filtrar/paginar en el cliente, como
// hacía antes getProducto.js para esta pantalla).
//
// Se hace en dos consultas a propósito, no una sola con include +
// limit:
//   1) Resuelve, sólo con los WHERE que apliquen, qué ids de producto
//      entran en la página pedida (sin traer variantes/imágenes todavía).
//   2) Trae esos ids puntuales con su include completo (variantes,
//      secciones, categoría), ordenado por id_variante ASC igual que
//      getById.js/getProducto.js, para que la "imagen principal" sea
//      siempre la misma en todos lados.
// Combinar un include hasMany (variantesproductos) con LIMIT/OFFSET en
// una sola consulta multiplica filas (un producto con 3 variantes cuenta
// como 3 en el límite) o fuerza a Sequelize a generar una subquery cuyo
// ORDER BY sobre la tabla incluida rompe. Separar en dos consultas evita
// las dos cosas.
const getCatalogo = async (query = {}) => {
  const {
    page = 1,
    limit = ITEMS_PER_PAGE_DEFAULT,
    categoria = "",
    subcategoria = "",
    tallas = "",
    colores = "",
    precioMax = "",
    orden = ""
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(60, parseInt(limit, 10) || ITEMS_PER_PAGE_DEFAULT));
  const offset = (pageNum - 1) * limitNum;

  const tallasArr = tallas ? String(tallas).split(",").filter(Boolean) : [];
  const coloresArr = colores ? String(colores).split(",").filter(Boolean) : [];

  const where = { archivado: false };

  if (subcategoria) {
    where.subcategoria = subcategoria;
  }

  if (precioMax !== "" && precioMax !== null && precioMax !== undefined) {
    const precioMaxNum = Number(precioMax);
    if (!Number.isNaN(precioMaxNum)) {
      where.precio = { [Op.lte]: precioMaxNum };
    }
  }

  // Talla/color: primero se resuelve qué productos tienen AL MENOS UNA
  // variante que matchee, y ese listado de ids se suma al WHERE
  // principal. Así el include del paso 2 sigue trayendo TODAS las
  // variantes de esos productos (no sólo la que matcheó el filtro).
  if (tallasArr.length > 0 || coloresArr.length > 0) {
    const whereVariante = {};
    if (tallasArr.length > 0) whereVariante.talla = { [Op.in]: tallasArr };
    if (coloresArr.length > 0) whereVariante.color = { [Op.in]: coloresArr };

    const variantesMatch = await variantesproductos.findAll({
      where: whereVariante,
      attributes: ["ProductoIdProducto"],
      group: ["ProductoIdProducto"]
    });

    const idsFiltradosPorVariante = variantesMatch.map((v) => v.ProductoIdProducto);

    if (idsFiltradosPorVariante.length === 0) {
      return { productos: [], total: 0, totalPages: 0, currentPage: pageNum };
    }

    where.id_producto = { [Op.in]: idsFiltradosPorVariante };
  }

  const includeCategoriaFiltro = categoria
    ? [{ model: Categorias, where: { nombre: categoria }, required: true, attributes: [] }]
    : [];

  let ordenPrincipal = [["id_producto", "DESC"]];
  if (orden === "precioAsc") {
    ordenPrincipal = [["precio", "ASC"], ["id_producto", "DESC"]];
  } else if (orden === "precioDesc") {
    ordenPrincipal = [["precio", "DESC"], ["id_producto", "DESC"]];
  }

  // Paso 1: sólo ids, ya paginados y ordenados.
  const { rows: idRows, count: total } = await Productos.findAndCountAll({
    where,
    attributes: ["id_producto"],
    include: includeCategoriaFiltro,
    order: ordenPrincipal,
    limit: limitNum,
    offset,
    subQuery: false,
    distinct: true
  });

  const idsPagina = idRows.map((p) => p.id_producto);

  if (idsPagina.length === 0) {
    return {
      productos: [],
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }

  // Paso 2: datos completos para esos ids puntuales, orden estable de
  // variantes para la imagen principal.
  const productosConVariantes = await Productos.findAll({
    where: { id_producto: { [Op.in]: idsPagina } },
    include: [
      { model: variantesproductos },
      { model: sections, through: { attributes: [] } },
      { model: Categorias }
    ],
    order: [[variantesproductos, "id_variante", "ASC"]]
  });

  // findAll con id IN [...] no garantiza devolver las filas en el mismo
  // orden que idsPagina, así que se reordena en JS para respetar el
  // orden/página resuelto en el paso 1.
  const porId = new Map(productosConVariantes.map((p) => [p.id_producto, p]));
  const productosOrdenados = idsPagina.map((id) => porId.get(id)).filter(Boolean);

  const productos = productosOrdenados.map((producto) => {
    let variantesProducto = [];
    let sectionsProducto = [];

    if (producto.sections) {
      sectionsProducto = producto.sections.map((section) => ({
        id: section.id,
        section: section.section,
        title: section.title
      }));
    }

    if (producto.variantesproductos) {
      variantesProducto = producto.variantesproductos.map((variante) => {
        const imagenUrls =
          variante.imagenes?.map((imagen) => imagen.replace(/\\/g, "/")) || [];

        return {
          idVariante: variante.id_variante,
          talla: variante.talla,
          color: variante.color,
          cantidad_disponible: variante.cantidad_disponible,
          imagenes: imagenUrls
        };
      });
    }

    return {
      id: producto.id_producto,
      nombre: producto.nombre_producto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      rama: producto.rama,
      categoria: producto.Categoria
        ? {
            id: producto.Categoria.id_categoria,
            nombre: producto.Categoria.nombre,
            slug: producto.Categoria.slug
          }
        : null,
      subcategoria: producto.subcategoria,
      variantes: variantesProducto,
      sections: sectionsProducto
    };
  });

  return {
    productos,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum
  };
};

module.exports = getCatalogo;
