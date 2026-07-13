import {
  GET_PRODUCTOS,
  ADD_PRODUCT,
  SEARCH_ID,
  PAGINADO,
  GET_MIS_PEDIDOS,
  INI_USUARIO,
  FILTER,
  ORDER,
  CARGAR_CLIENTE,
  CERRAR_SESION,
  AGREGAR_AL_CARRITO,
  ELIMINAR_PRODUCTO_CARRITO,
  VACIAR_CARRITO,
  CAMBIO,
  BORRAR_PRODUCTO,
  POST_PEDIDO,
  ACTUALIZAR_VARIANTES,
  ACTUALIZAR_CARRITO,
  BUSCAR_NOMBRE,
  ADD_USUARIO,
  GET_PEDIDOS,
  GET_CLIENTES,
  OFERTA,
  GET_OFERTAS,
  BORRAR_OFERTA,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  UPDATE_ESTADO_PEDIDO,
  ELIMINAR_PEDIDO,
  GET_CATEGORIAS,
  CREATE_CATEGORIA,
  UPDATE_CATEGORIA,
  DELETE_CATEGORIA,
  GET_BANNERS,
  GET_BANNERS_ADMIN,
  GET_CONFIGURACION,
  MOSTRAR_TOAST,
  GET_ESTADISTICAS,
  GET_CUPONES,
  GET_CAJA_ACTUAL,
  GET_LAYOUT_HOME,
  GET_LAYOUT_HOME_BORRADOR,
  GET_TESTIMONIOS,
  GET_TESTIMONIOS_ADMIN,
  GET_CATALOGO,
  GET_FACETAS
} from "./action"

const initialState = {
  allProductosforFiltro: [],
  allProductos: [],
  allProductosBackUp: [],
  totalPages: 1,
  currentPage: 1,
  info: [],
  filter: false,
  allClientes: [],
  allClientesBackUp: [],
  carrito: [],
  orderProducto: [],
  filtered: [],
  cliente: null,
  loading: false,
  errorMessage: '',
  emailExists: false,
  allPedidos: [],
  allPedidosBackup: [],
  misPedidos: [],
  isLoggedIn: false,
  isLoggedInAd: false,
  cantidadOferta: {},
  ofertasActivas: [],
  categorias: [],
  banners: [],
  bannersAdmin: [],
  configuracion: null,
  toast: null,
  estadisticas: null,
  cupones: [],
  cajaActual: null,
  layoutHome: null,
  layoutHomeBorrador: null,
  testimonios: [],
  testimoniosAdmin: [],
  // Catálogo paginado/filtrado en el servidor (Catalogo.jsx /
  // CatalogoSection.jsx). Deliberadamente separado de allProductos/
  // currentPage/totalPages, que siguen usando el patrón viejo en otras
  // pantallas (ver comentario en action.js sobre GET_CATALOGO).
  catalogo: {
    productos: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
  },
  facetas: {
    tallas: [],
    colores: [],
    precioMaximo: 0,
  },
}

const ITEMS_PER_PAGE = 12;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTOS:
      const allProductos = action.payload; // Obtener todos los productos

      // Dividir los productos según la cantidad que quieres mostrar por página

      return {
        ...state,
        allProductosforFiltro: allProductos,
        allProductos: allProductos.slice(0, ITEMS_PER_PAGE),
        allProductosBackUp: allProductos,
        totalPages: Math.ceil(allProductos.length / ITEMS_PER_PAGE), // Actualizar el total de páginas
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_CATALOGO:
      return {
        ...state,
        catalogo: {
          productos: action.payload.productos || [],
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
          currentPage: action.payload.currentPage || 1,
        },
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_FACETAS:
      return {
        ...state,
        facetas: {
          tallas: action.payload.tallas || [],
          colores: action.payload.colores || [],
          precioMaximo: action.payload.precioMaximo || 0,
        },
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ADD_PRODUCT:

      const newProducto = action.payload;

      return {
        ...state,
        allProductos: [newProducto, ...state.allProductos],
        totalPages: Math.ceil([newProducto, ...state.allProductos].length / ITEMS_PER_PAGE),
      };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case SEARCH_ID:
      return {
        ...state,
        info: action.payload,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case PAGINADO: {
      if (action.payload === "reset") {
        return { ...state, currentPage: 1 };
      }

      const nextPage =
        action.payload === "next"
          ? state.currentPage + 1
          : action.payload === "prev"
            ? state.currentPage - 1
            : action.payload;

      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      // 👇 clave: usar filtrados si hay filtro activo
      const baseArray = state.filter ? state.filtered : state.allProductosBackUp;

      if (startIndex >= baseArray.length || startIndex < 0) return state;

      return {
        ...state,
        allProductos: baseArray.slice(startIndex, endIndex),
        currentPage: nextPage,
      };
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case INI_USUARIO:
      const userInfo = action.payload; // Ajusta esta línea según la estructura de datos que recibes

      return {
        ...state,
        isLoggedIn: true,
        cliente: userInfo, // Puedes incluir más propiedades del usuario si las recibes del servidor
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case ORDER:
      const newSortOrder = action.payload;

      // Si hay un filtro activo, hay que ordenar sobre lo ya filtrado
      // (state.filtered), no sobre el listado completo sin filtrar.
      // Si no hay filtro, se ordena sobre todo el catálogo.
      const baseParaOrdenar = state.filter
        ? state.filtered
        : state.allProductosBackUp;

      // Verificar si el nuevo tipo de orden es una cadena vacía
      const isClearOrder = newSortOrder === "";

      // Si el nuevo tipo de orden es una cadena vacía, restablecer al estado original sin orden aplicado
      if (isClearOrder) {
        return {
          ...state,
          allProductos: baseParaOrdenar.slice(0, ITEMS_PER_PAGE), // Restaurar sin orden, respetando el filtro activo
          sortOrder: "", // Limpiar el tipo de orden
        };
      }

      // Si el nuevo tipo de orden no es una cadena vacía, aplicar el orden seleccionado
      let ordenarProducto = [];

      if (newSortOrder === "precioAsc") {
        ordenarProducto = [...baseParaOrdenar].sort((prev, next) => prev.precio - next.precio);
      } else if (newSortOrder === "precioDesc") {
        ordenarProducto = [...baseParaOrdenar].sort((prev, next) => next.precio - prev.precio);
      }

      return {
        ...state,
        allProductos: ordenarProducto.slice(0, ITEMS_PER_PAGE), // Aplicar el nuevo orden a la primera página
        // Solo se pisa allProductosBackUp cuando NO hay filtro activo:
        // si hay un filtro, el backup completo del catálogo debe
        // quedar intacto para poder "deshacer" el filtro más tarde.
        ...(state.filter
          ? { filtered: ordenarProducto }
          : { allProductosBackUp: ordenarProducto }),
        sortOrder: newSortOrder,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case FILTER: {
      const {
        categoria,
        subcategoria,
        tallas = [],
        colores = [],
        precioMax = null,
      } = action.payload;

      // Antes esto se marcaba "filter: true" SIEMPRE que se disparaba la
      // acción, incluso sin ningún criterio real (el sidebar de filtros
      // la dispara al montar la página, con todo vacío). Eso dejaba el
      // paginado leyendo para siempre de `state.filtered` en vez del
      // catálogo completo, y si ese primer filtro llegaba a correr antes
      // de que el catálogo terminara de cargar, `filtered` quedaba
      // corto/vacío mientras `totalPages` ya mostraba el número real de
      // páginas — resultado: tocar un número de página que caía fuera de
      // ese `filtered` corto no hacía nada.
      const hayFiltroActivo =
        Boolean(categoria) ||
        Boolean(subcategoria) ||
        tallas.length > 0 ||
        colores.length > 0 ||
        (precioMax !== null && precioMax !== undefined);

      let filteredProducts = state.allProductosBackUp;

      // 👉 Filtrar por Categoría
      // El backend devuelve "categoria" como un objeto { id, nombre, slug }
      // (o null si el producto no tiene categoría asignada), no como texto.
      // Por eso se compara contra categoria?.nombre, no contra el objeto.
      if (categoria) {
        const categoriaFiltrada = categoria.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (producto) =>
            producto.categoria?.nombre &&
            producto.categoria.nombre.toLowerCase() === categoriaFiltrada
        );
      }

      // 👉 Filtrar por Subcategoría
      if (subcategoria) {
        const subcategoriaFiltrada = subcategoria.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (producto) =>
            producto.subcategoria &&
            producto.subcategoria.toLowerCase() === subcategoriaFiltrada
        );
      }

      // 👉 Filtrar por talla: alcanza con que UNA variante del producto
      // tenga alguna de las tallas elegidas (un producto puede tener
      // variantes en varios talles).
      if (tallas.length > 0) {
        filteredProducts = filteredProducts.filter((producto) =>
          (producto.variantes || []).some((variante) =>
            tallas.includes(variante.talla)
          )
        );
      }

      // 👉 Filtrar por color: mismo criterio que talla.
      if (colores.length > 0) {
        filteredProducts = filteredProducts.filter((producto) =>
          (producto.variantes || []).some((variante) =>
            colores.includes(variante.color)
          )
        );
      }

      // 👉 Filtrar por precio máximo. precioMax en null/undefined = sin
      // límite. Importante que el "sin límite" sea el valor por
      // defecto: si en cambio el default fuera un número fijo, se
      // ocultarían productos caros sin que el usuario haya tocado nada.
      if (precioMax !== null && precioMax !== undefined) {
        filteredProducts = filteredProducts.filter(
          (producto) => Number(producto.precio) <= Number(precioMax)
        );
      }

      // 🔑 Paginado siempre sobre productos filtrados
      const totalFilteredItems = filteredProducts.length;
      const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);

      // Se resetea siempre a la página 1, así que el recorte tiene que
      // arrancar en el índice 0 — antes usaba state.currentPage (la
      // página VIEJA) para cortar, pero currentPage se pisaba a 1 en el
      // mismo return, así que mostraba datos de una página y decía
      // estar en otra.
      const paginatedFilteredProducts = filteredProducts.slice(0, ITEMS_PER_PAGE);

      return {
        ...state,
        allProductos: paginatedFilteredProducts,   // 👈 lo que se renderiza
        filtered: filteredProducts,                // 👈 guardas TODOS los filtrados aquí
        filter: hayFiltroActivo,
        totalPages,
        currentPage: 1,                            // 👈 resetea siempre a la página 1
        filters: { ...state.filters, categoria, subcategoria, tallas, colores, precioMax },
      };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    case CARGAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload // Actualiza la información del cliente en el estado
      };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    case CERRAR_SESION:
      return {
        ...state,
        isLoggedIn: false,
        usuario: null,
        cliente: null, // Agrega aquí cualquier otro estado relacionado con la sesión que necesites limpiar
      };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    case AGREGAR_AL_CARRITO:
      const nuevoProducto = action.payload;
      return {
        ...state,
        carrito: [...state.carrito, nuevoProducto],
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case ELIMINAR_PRODUCTO_CARRITO:
      const index = action.payload;
      const nuevosProductos = [...state.carrito];
      nuevosProductos.splice(index, 1);
      return {
        ...state,
        carrito: nuevosProductos,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case VACIAR_CARRITO:
      return {
        ...state,
        carrito: [],
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case CAMBIO:
      const productoModificado = action.payload; // Datos del producto modificado
      // Verificar que el ID del producto a modificar existe en el estado
      const productoExistente = state.allProductosBackUp.find(producto => producto.id === productoModificado.id);
      if (!productoExistente) {
        // Si el producto no existe, retorna el estado actual sin hacer cambios
        return state;
      }
      // Actualizar el producto en el estado
      const productosActualizados = state.allProductosBackUp.map(producto => {
        if (producto.id === productoModificado.id) {
          // Crear un nuevo objeto producto solo si se encuentra el ID correspondiente
          return {
            ...producto,
            variantes: producto.variantes.map(variante => {
              if (variante.id === productoModificado.idVariante) {
                // Actualizar la variante si el ID de la variante coincide con el ID recibido
                return {
                  ...variante,
                  cantidad_disponible: productoModificado.cantidad_disponible,
                  color: productoModificado.color,
                  talla: productoModificado.talla,
                  // Agrega otras propiedades aquí si es necesario
                };
              }
              return variante;
            })
          };
        }
        return producto;
      });

      return {
        ...state,
        allProductosBackUp: productosActualizados, // Actualiza el array completo de productos con las variantes modificadas
        // Actualiza los productos mostrados si es necesario
        allProductos: productosActualizados.slice(0, ITEMS_PER_PAGE),
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case BORRAR_PRODUCTO:
      const productoBorrar = action.payload;

      const productosFiltrados = state.allClientesBackUp.filter(
        (producto) => producto.id !== productoBorrar
      );
      const carritoActualizado = state.carrito.filter(
        (producto) => producto.id !== productoBorrar
      );

      return {
        ...state,
        allProductosBackUp: productosFiltrados, // Actualizar la lista de productos sin el producto borrado
        allProductos: productosFiltrados.slice(0, ITEMS_PER_PAGE), // Actualizar la lista mostrada si es necesario
        carrito: carritoActualizado, // Actualizar el carrito sin el producto borrado
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case POST_PEDIDO:

    case POST_PEDIDO:
      return {
        ...state,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case UPDATE_ESTADO_PEDIDO:

      return {

        ...state,

        allPedidos:
          state.allPedidos.map(
            pedido =>
              pedido.id_pedido ===
                action.payload.id_pedido
                ? action.payload
                : pedido
          ),

        allPedidosBackUp:
          state.allPedidosBackUp.map(
            pedido =>
              pedido.id_pedido ===
                action.payload.id_pedido
                ? action.payload
                : pedido
          )
      };


      return {
        ...state,
        carrito: [], // Vaciar el carrito después de completar el pedido
        allProductosBackUp: productosActualizadosCompra, // Actualizar la lista completa de productos con las cantidades actualizadas
        allProductos: productosActualizadosCompra.slice(0, ITEMS_PER_PAGE), // Actualizar los productos mostrados si es necesario
        productosDespuesPedido: productosEnCarrito, // Agregar productos al estado después del pedido
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ACTUALIZAR_VARIANTES:
      const { id, cantidad_disponible } = action.payload;

      const variantesIndex = state.carrito.findIndex((producto) => producto.id === id);

      if (variantesIndex !== -1) {
        const carritoActualizado = [...state.carrito];
        carritoActualizado[variantesIndex] = {
          ...carritoActualizado[variantesIndex], cantidad_disponible
        };

        const allProductosActualizados = state.allProductos.map(producto => {
          if (producto.id === id) {
            return {
              ...producto,
              variantes: producto.variantes.map(variante => {
                if (variante.id === id) {
                  return {
                    ...variante,
                    cantidad_disponible: cantidad_disponible
                  };
                }
                return variante;
              })
            };
          }
          return producto;
        });

        return {
          ...state,
          carrito: carritoActualizado,
          allProductos: allProductosActualizados,
        };
      }
      return state; // Agregar este return al final del case
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ACTUALIZAR_CARRITO:
      return {
        ...state,
        carrito: action.payload,
      };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case BUSCAR_NOMBRE:
      return {
        ...state,
        allProductos: action.payload,
        allClientesBackUp: action.payload,
        filter: false,
        totalPages: Math.ceil(action.payload.length / ITEMS_PER_PAGE),
        currentPage: 1,
      }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ELIMINAR_PEDIDO:

      return {

        ...state,

        allPedidos:
          state.allPedidos.filter(
            pedido =>
              pedido.id_pedido !==
              action.payload
          ),

        allPedidosBackUp:
          state.allPedidosBackUp.filter(
            pedido =>
              pedido.id_pedido !==
              action.payload
          )
      };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ADD_USUARIO:
      const nuevoUsuario = action.payload; // Obtener los datos del nuevo usuario agregado desde la respuesta del servidor
      return {
        ...state,
        allClientes: [...state.allClientes, nuevoUsuario], // Agregar el nuevo usuario al array de clientes en el estado
        // También puedes hacer otros ajustes necesarios al estado aquí
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_MIS_PEDIDOS:
      return {
        ...state,
        misPedidos: action.payload,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_PEDIDOS:

      return {

        ...state,

        allPedidos: action.payload,

        allPedidosBackUp:
          action.payload
      };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_CLIENTES:
      return {
        ...state,
        allClientes: action.payload,
        allClientesBackUp: action.payload,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    case 'ADMIN_LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedInAd: true,
        error: null,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    case ADMIN_LOGOUT:
      return {
        ...state,
        isLoggedInAd: false,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    case OFERTA:
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
        };
      }

      const { producto_id, descuento, inicio, fin } = action.payload;


      const newState = {
        ...state,
        cantidadOferta: {
          ...state.cantidadOferta,
          [producto_id]: {
            descuento,
            inicio,
            fin,
          },
        },
        error: null,
      };
      return newState;

    ///////////////////////////////////////////////////////////////////////////  
    case GET_OFERTAS:
      const ofertasActivas = action.payload
      return {
        ...state,
        ofertasActivas: ofertasActivas// Almacena las ofertas activas recibidas del servidor
      };

    case GET_BANNERS:
      return {
        ...state,
        banners: action.payload
      };

    case GET_BANNERS_ADMIN:
      return {
        ...state,
        bannersAdmin: action.payload
      };

    case GET_CONFIGURACION:
      return {
        ...state,
        configuracion: action.payload
      };

    case GET_LAYOUT_HOME:
      return {
        ...state,
        layoutHome: action.payload
      };

    case GET_LAYOUT_HOME_BORRADOR:
      return {
        ...state,
        layoutHomeBorrador: action.payload
      };

    case GET_TESTIMONIOS:
      return {
        ...state,
        testimonios: action.payload
      };

    case GET_TESTIMONIOS_ADMIN:
      return {
        ...state,
        testimoniosAdmin: action.payload
      };

    case MOSTRAR_TOAST:
      return {
        ...state,
        toast: action.payload
      };

    case GET_ESTADISTICAS:
      return {
        ...state,
        estadisticas: action.payload
      };

    case GET_CUPONES:
      return {
        ...state,
        cupones: action.payload
      };

    case GET_CAJA_ACTUAL:
      return {
        ...state,
        cajaActual: action.payload
      };

    ///////////////////////////////////////////////////////////////////////////  
    case BORRAR_OFERTA:
      const productoIdParaBorrar = action.payload;

      // Actualizar `cantidadOferta` eliminando la oferta del producto correspondiente
      const nuevaCantidadOferta = { ...state.cantidadOferta };
      delete nuevaCantidadOferta[productoIdParaBorrar];

      // Filtrar las ofertas activas para eliminar la oferta del producto correspondiente
      const nuevasOfertasActivas = state.ofertasActivas.filter(
        (oferta) => oferta.producto_id !== productoIdParaBorrar
      );

      return {
        ...state,
        cantidadOferta: nuevaCantidadOferta, // Actualizar `cantidadOferta` sin la oferta borrada
        ofertasActivas: nuevasOfertasActivas, // Actualizar `ofertasActivas` sin la oferta borrada
      };
    ///////////////////////////////////////////////////////////////////////////  
    case GET_CATEGORIAS:
      return {
        ...state,
        categorias: action.payload
      };
    case CREATE_CATEGORIA:

      return {
        ...state,
        categorias: [
          ...state.categorias,
          action.payload
        ]
      };

    case UPDATE_CATEGORIA:

      return {
        ...state,
        categorias:
          state.categorias.map(
            (categoria) =>
              categoria.id_categoria ===
                action.payload.id_categoria
                ? action.payload
                : categoria
          )
      };

    case DELETE_CATEGORIA:

      return {
        ...state,
        categorias:
          state.categorias.filter(
            (categoria) =>
              categoria.id_categoria !==
              action.payload
          )
      };

    ///////////////////////////////////////////////////////////////////////////  

    default:
      return state;

  }
}


export default reducer;