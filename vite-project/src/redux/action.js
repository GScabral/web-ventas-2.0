import axios from "axios";

// URL base del backend. En desarrollo cae a localhost:3004 (como hasta ahora).
// En producción, definí VITE_API_URL en un archivo .env (o en las variables
// de entorno del hosting del front) con la URL real del backend desplegado.
export const API_URL = "https://web-ventas-2-0-2.onrender.com" ;

const storedAdminToken = localStorage.getItem("adminToken");
if (storedAdminToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${storedAdminToken}`;
}

//PRODUCTOS
export const GET_PRODUCTOS = "GET_PRODUCTOS";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const SEARCH_ID = "SEARCH_ID";
export const PAGINADO = "PAGINADO";
export const FILTER = "FILTER";
export const ORDER = "ORDER";
export const AGREGAR_AL_CARRITO = 'AGREGAR_AL_CARRITO';
export const ELIMINAR_PRODUCTO_CARRITO = "ELIMINAR_PRODUCTO_CARRITO";
export const VACIAR_CARRITO = "VACIAR_CARRITO";
export const AGREGAR_FAV = " AGREGAR_FAV";
export const ELIMINAR_PRODUCTO_FAV = "ELIMINAR_PRODUCTO_FAV";
export const CAMBIO = "CAMBIO";
export const BORRAR_PRODUCTO = "BORRAR_PRODUCTO";
export const ACTUALIZAR_VARIANTES = "ACTUALIZAR_VARIANTES";
export const ACTUALIZAR_CARRITO = "ACTUALIZAR_CARRITO"; export const BUSCAR_NOMBRE = "BUSCAR_NOMBRE";
export const GET_PEDIDOS = 'GET_PEDIDOS';
export const OFERTA = "OFERTA";
export const BORRAR_OFERTA = "BORRAR_OFERTA";
export const ENVIAR_ESTADO = 'ENVIAR_ESTADO';
export const GET_OFERTAS = "GET_OFERTAS";
export const UPDATE_ESTADO_PEDIDO = "UPDATE_ESTADO_PEDIDO";
export const GET_CATEGORIAS = "GET_CATEGORIAS";
export const CREATE_CATEGORIA = "CREATE_CATEGORIA";
export const UPDATE_CATEGORIA = "UPDATE_CATEGORIA";
export const DELETE_CATEGORIA = "DELETE_CATEGORIA";
export const GET_BANNERS = "GET_BANNERS";
export const GET_BANNERS_ADMIN = "GET_BANNERS_ADMIN";
export const GET_CONFIGURACION = "GET_CONFIGURACION";
export const ELIMINAR_PEDIDO = "ELIMINAR_PEDIDO";
//CLIENTE
export const ADD_USUARIO = "ADD_USUARIO";
export const INI_USUARIO = "INI_USUARIO";
export const CARGAR_CLIENTE = "CARGAR_CLIENTE";
export const CERRAR_SESION = "CERRAR_SESION";
export const CHECK_EMAIL_EXISTENCE_REQUEST = 'CHECK_EMAIL_EXISTENCE_REQUEST';
export const CHECK_EMAIL_EXISTENCE_SUCCESS = 'CHECK_EMAIL_EXISTENCE_SUCCESS';
export const CHECK_EMAIL_EXISTENCE_FAILURE = 'CHECK_EMAIL_EXISTENCE_FAILURE';
export const OBTENER_INFO_USUARIO = " OBTENER_INFO_USUARIO";
export const GET_CLIENTES = 'GET_CLIENTES';
export const ADMIN_LOGIN_SUCCESS = "ADMIN_LOGIN_SUCCESS";
export const ADMIN_LOGOUT = "ADMIN_LOGOUT";

//PEDidos
export const POST_PEDIDO = "POST_PEDIDO";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getProductos = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/producto/producto`);


      dispatch({
        type: GET_PRODUCTOS,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getAllClientes = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/cliente/allClientes`)

      dispatch({
        type: GET_CLIENTES,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const getPedidoById = (id) => {
  return async () => {

    const response =
      await axios.get(
        `${API_URL}/pedido/${id}`
      );

    return response.data;
  };
};
export const getPedidos = () => {
  return async function (dispatch) {
    try {

      const response = await axios.get(
        `${API_URL}/pedido/Lpedidos`
      );

      dispatch({
        type: GET_PEDIDOS,
        payload: response.data,
      });

    } catch (error) {
      console.error(error);
    }
  };
};

export const addPedido = (pedidoData) => {
  return async (dispatch) => {
    try {

      const response = await axios.post(
        `${API_URL}/pedido/nuevoPedido`,
        pedidoData
      );

      dispatch({
        type: POST_PEDIDO,
        payload: response.data,
      });

      return response.data;

    } catch (error) {

      console.error(error);

      throw error;
    }
  };
};
export const addProduct = (formData) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        `${API_URL}/producto/nuevoProducto`,
        formData
      );

      dispatch({
        type: ADD_PRODUCT,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("ERROR:", error);

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      }

      throw error;
    }
  };
};
export const getById = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/producto/ProductoId/${id}`);

      if (response.data) {
        dispatch({
          type: SEARCH_ID,
          payload: response.data
        });
      } else {
        dispatch({
          type: SEARCH_ID,
          payload: {}, // Establecer payload como un objeto vacío o null, no como una cadena vacía
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export function paginado(order) {
  return async function (dispatch) {
    try {
      dispatch({
        type: PAGINADO,
        payload: order
      })
    } catch (error) {
      alert(error.response.data.error)
    }
  }
}

export const filterProduc = (filtro) => {
  return async function (dispatch) {


    try {
      dispatch({
        type: FILTER,
        payload: filtro,

      });
    } catch (error) {
      console.error(error);
    }
  };
};

export function orderProducto(orderAux) {
  return async function (dispatch) {
    try {
      dispatch({
        type: ORDER,
        payload: orderAux
      })
    } catch (error) {
      alert(error.response.data.error)
    }
  }
}

export const createUsuario = (userData) => {

  return async function (dispatch) {
    try {
      const response = await axios.post(`${API_URL}/cliente/nuevoCliente`, userData);
      dispatch({
        type: ADD_USUARIO, // Ajusta este tipo de acción según tu configuración de Redux
        payload: response.data, // Puedes ajustar esto dependiendo de la estructura de datos devuelta por el servidor
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const ingresarUsuario = (userData) => {
  return async function (dispatch) {
    try {


      const response = await axios.post(`${API_URL}/cliente/login`, userData);



      if (response.status === 200) {
        if (response.data) {
          dispatch({
            type: INI_USUARIO,
            payload: response.data,
          });
        } else {
          console.error('No se recibieron datos en la respuesta del servidor');
        }
      } else {

        throw new Error('Error en la solicitud: Código de estado ' + response.status);
      }

      // Devolver la respuesta del servidor para que pueda ser manejada en el componente
      return response;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      console.error('Error capturado:', error);
      throw error;
    }
  };
};

export const obtenerInformacionUsuario = (correo, contraseña) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(`${API_URL}/cliente/InfoUsuario`, { correo, contraseña });

      console.log("Respuesta del servidor al obtener información del usuario:", response);

      if (response.status === 200) {
        if (response.data && response.data.user) {
          // Si hay datos de usuario en la respuesta, actualiza el estado con la información del usuario
          dispatch({
            type: OBTENER_INFO_USUARIO,
            payload: response.data.user,
          });
        } else {
          console.error('No se recibieron datos de usuario en la respuesta del servidor');
          // Podrías establecer un mensaje de error en el estado de tu aplicación si lo deseas
        }
      } else {
        console.error('El servidor respondió con un código de estado diferente a 200:', response.status);
        // Manejo de errores para códigos de estado no exitosos
        // Por ejemplo, puedes lanzar una excepción para que se maneje en el bloque catch
        throw new Error('Error en la solicitud: Código de estado ' + response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Aquí puedes manejar el error de manera adecuada, como establecer un mensaje de error en el estado
      // También podrías lanzar una nueva excepción si necesitas manejarla más arriba en la pila de llamadas
      throw error;
    }
  };
};


export const obtenerClientePorId = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/cliente/cliente/${id}`);

      if (response.status !== 200) {
        throw new Error('Error al obtener el cliente por ID');
      }

      dispatch({
        type: CARGAR_CLIENTE,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: 'OBTENER_CLIENTE_POR_ID_ERROR',
        payload: error.message,
      });
    }
  };
};


export const cerrarSesion = () => {

  return {
    type: CERRAR_SESION,
  };
};



export const agregarAlCarrito = (producto) => {
  return {
    type: AGREGAR_AL_CARRITO,
    payload: producto,
  };
};

export const eliminarProductoCarrito = (index) => {
  return {
    type: ELIMINAR_PRODUCTO_CARRITO,
    payload: index,
  };
};

export const vaciarCarrito = () => {
  return {
    type: VACIAR_CARRITO,
  };
};

export const agregarFav = (producto) => {
  return {
    type: AGREGAR_FAV,
    payload: producto,
  };
};

export const eliminarFav = (index) => {
  return {
    type: ELIMINAR_PRODUCTO_FAV,
    payload: index,
  };
};

export const cambios = (id, datosProducto) => {
  return async function (dispatch) {
    try {
      const response = await axios.patch(`${API_URL}/Nadmin/cambioAdmin/${id}`, datosProducto);
      dispatch({
        type: CAMBIO,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Puedes realizar alguna acción aquí en caso de error, como enviar un mensaje de error al usuario o realizar otras operaciones necesarias.
      if (error.response) {
        // Si la solicitud fue realizada y el servidor respondió con un status code fuera del rango 2xx
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Código de estado HTTP:', error.response.status);
      } else if (error.request) {
        // Si la solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Si ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
      // Aquí podrías ejecutar alguna acción específica para manejar el error, como dispatch a un estado de error en Redux, mostrar un mensaje al usuario, etc.
      throw error; // Vuelve a lanzar el error para que otros componentes puedan manejarlo si es necesario.
    }
  };
};

export const borrar = (id) => {
  return async function (dispatch) {
    try {

      const response = await axios.delete(`${API_URL}/producto/eliminar/${id}`)

      if (response.status !== 200) {
        throw new Error('Error al eliminar el producto');
      }

      dispatch({
        type: BORRAR_PRODUCTO,
        payload: id,
      });

      return response.data;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  };
};



export const actualizarVariante = (id, cantidad_disponible) => { // Asegúrate de pasar cantidad_disponible aquí
  console.log(id, cantidad_disponible)
  return async function (dispatch) {
    try {

      const response = await axios.patch(`${API_URL}/producto/cambio/${id}`, {
        cantidad_disponible: cantidad_disponible // Aquí envía cantidad_disponible
      });
      // Despachar la acción después de que la solicitud sea exitosa
      dispatch({
        type: ACTUALIZAR_VARIANTES,
        payload: { id, cantidad_disponible },
      });

    } catch (error) {
      console.error("Error al actualizar variante:", error);
      // Puedes manejar el error de alguna manera si es necesario
    }
  };
}

export const actualizarEstadoPedidoGeneral =
  (id, estado) =>
    async (dispatch) => {

      try {

        const response =
          await axios.put(
            `${API_URL}/pedido/${id}/estado`,
            { estado }
          );

        dispatch({
          type:
            UPDATE_ESTADO_PEDIDO,

          payload:
            response.data.pedido,
        });

        return response.data;

      } catch (error) {
        console.error(error);
      }
    };



export const cancelarPedido =
  (id) =>
    async (dispatch) => {

      try {

        const response =
          await axios.put(
            `${API_URL}/pedido/${id}/cancelar`
          );

        dispatch({
          type:
            UPDATE_ESTADO_PEDIDO,

          payload:
            response.data.pedido,
        });

        return response.data;

      } catch (error) {
        console.error(error);
      }
    };

export const eliminarPedido =
  (id) =>
    async (dispatch) => {

      try {

        await axios.delete(
          `${API_URL}/pedido/${id}`
        );

        dispatch({
          type:
            ELIMINAR_PEDIDO,

          payload: id,
        });

      } catch (error) {
        console.error(error);
      }
    };

// Actualiza un producto puntual del carrito (ej. cambiar la cantidad
// desde CartItem). Recibe el índice del producto en el carrito y el
// producto ya con los datos nuevos, y arma acá el array completo con
// ese único ítem reemplazado — así el componente que dispara la
// acción no necesita conocer el resto del carrito ni el reducer
// necesita hacer lógica extra.
export const actualizarCarrito = (index, productoActualizado) => (dispatch, getState) => {
  const carritoActual = getState().carrito;

  const nuevoCarrito = carritoActual.map((item, i) =>
    i === index ? productoActualizado : item
  );

  dispatch({
    type: ACTUALIZAR_CARRITO,
    payload: nuevoCarrito,
  });
};


export const buscar = (name) => {
  return async function (dispatch) {
    try {

      const response = await axios.get(`${API_URL}/producto/name/${name}`);

      // Log the data to the console
      // console.log("Resultados de la búsqueda:",response);

      if (response.data.length > 0) {
        dispatch({
          type: BUSCAR_NOMBRE,
          payload: response.data,
        });
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const checkEmailExistence = (correo) => {
  return async (dispatch) => {
    dispatch({ type: CHECK_EMAIL_EXISTENCE_REQUEST });

    try {
      const response = await axios.get('/check', { params: { correo } });

      // Si la solicitud fue exitosa, envía el resultado al reducer
      dispatch({
        type: CHECK_EMAIL_EXISTENCE_SUCCESS,
        payload: response.data // Esto debería ser el mensaje del servidor
      });
    } catch (error) {
      // Si hubo un error en la solicitud, envía el error al reducer
      console.error("Error al verificar el correo electrónico:", error.message);
      dispatch({
        type: CHECK_EMAIL_EXISTENCE_FAILURE,
        error: error.message // Esto debería ser el mensaje de error del servidor
      });
    }
  };
};


export const enviarEstado = (nuevoEstado) => ({
  type: ENVIAR_ESTADO,
  payload: nuevoEstado,
});


export const enviarCorreo = (idPedido, infoPedido, correo, total) => async dispatch => {


  try {
    const response = await axios.post(`${API_URL}/Nadmin/confirmacionPedido`, {
      idPedido,
      infoPedido,
      correo,
      total
    });
    dispatch({ type: "ENVIAR_CORREO_EXITO", payload: response.data });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    dispatch({ type: "ENVIAR_CORREO_ERROR", error });
  }
};




export const LoginAdmin = (password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL}/Nadmin/loginc`, {
        password,
      });

      if (response.data?.token) {
        localStorage.setItem('adminToken', response.data.token);
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        dispatch({ type: ADMIN_LOGIN_SUCCESS });
        return { success: true };
      }

      const errorMessage = response.data?.error || 'Autenticación fallida';
      dispatch({ type: 'ADMIN_LOGIN_FAILURE', payload: { error: errorMessage } });
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error(error);
      dispatch({ type: 'ADMIN_LOGIN_FAILURE', payload: { error: error.message } });
      throw error;
    }
  };
};

// Cierra la sesión de admin: limpia el token guardado y el header por defecto,
// y resetea el estado en redux para que el panel vuelva a pedir contraseña.
export const logoutAdmin = () => {
  return (dispatch) => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common.Authorization;
    dispatch({ type: ADMIN_LOGOUT });
  };
};

// Verifica contra el backend si el token guardado en localStorage sigue siendo
// válido (no venció, no es inválido). Si no lo es, limpia la sesión local.
// Se usa al montar el panel admin para no confiar a ciegas en localStorage.
export const verifyAdminToken = () => {
  return async (dispatch) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      dispatch({ type: ADMIN_LOGOUT });
      return { success: false };
    }

    try {
      const response = await axios.get(`${API_URL}/Nadmin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        dispatch({ type: ADMIN_LOGIN_SUCCESS });
        return { success: true };
      }

      dispatch(logoutAdmin());
      return { success: false };
    } catch (error) {
      // Token inválido o vencido (401/403), o backend no disponible:
      // en cualquier caso, no dejamos al usuario "logueado" a medias.
      console.error('Token de admin inválido o expirado:', error.message);
      dispatch(logoutAdmin());
      return { success: false };
    }
  };
};

export const ofertas = (oferta) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL}/oferta/nuevaOferta`, {
        oferta: oferta
      });
      dispatch({ type: OFERTA, payload: response.data }); // Dispara una acción de éxito con los datos devueltos por el servidor si es necesario
      return response; // Devuelve la respuesta completa de axios si es necesario
    } catch (error) {
      console.error('Error en la solicitud de oferta:', error);
      dispatch({ type: 'OFERTA_FAILURE', payload: { error: error.message } }); // Dispara una acción de error con el mensaje de error
      throw error; // Propaga el error para manejarlo en el contexto superior si es necesario
    }
  };
};

export const getOfertas = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/oferta/ofertas`);

      dispatch({
        type: GET_OFERTAS,
        payload: response.data,
      });

    } catch (error) {
      console.error('Error al obtener ofertas activas:', error); // Mostrar error específico
    }
  };
};


export const borrarOferta = (id) => {
  return async (dispatch) => {

    try {

      const borrar = await axios.delete(
        `${API_URL}/oferta/eliminar/${id}`
      );

      dispatch({
        type: BORRAR_OFERTA,
        payload: id,
      });

    } catch (error) {

      console.error(
        "Error eliminando oferta:",
        error
      );

    }

  };
};

export const createCategoria =
  (nombre) =>
    async (dispatch) => {

      try {

        const { data } =
          await axios.post(
            `${API_URL}/producto/categorias`,
            {
              nombre
            }
          );

        dispatch({
          type: "CREATE_CATEGORIA",
          payload: data
        });

        return data;

      } catch (error) {

        console.error(error);
        throw error;

      }
    };
export const updateCategoria =
  (id, nombre) =>
    async (dispatch) => {

      try {

        const { data } =
          await axios.put(
            `${API_URL}/producto/categorias/${id}`,
            {
              nombre
            }
          );

        dispatch({
          type: "UPDATE_CATEGORIA",
          payload: data
        });

      } catch (error) {
        console.error(error);
      }
    };

export const deleteCategoria =
  (id) =>
    async (dispatch) => {

      try {

        await axios.delete(
          `${API_URL}/producto/categorias/${id}`
        );

        dispatch({
          type: "DELETE_CATEGORIA",
          payload: id
        });

      } catch (error) {
        console.error(error);
      }
    };


export const getCategorias =
  () => async (dispatch) => {

    try {

      const response = await axios.get(`${API_URL}/producto/traercategorias`);

      dispatch({
        type: "GET_CATEGORIAS",
        payload: response.data
      });

    } catch (error) {
      console.error(error);
    }
  };

// Banners promocionales: lo que se ve en la tira de la home (banner
// grande + banners chicos), gestionables desde el admin.

export const getBanners = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/banner/activos`);

      dispatch({
        type: GET_BANNERS,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error al obtener banners:', error);
    }
  };
};

export const getBannersAdmin = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/banner`);

      dispatch({
        type: GET_BANNERS_ADMIN,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error al obtener banners (admin):', error);
    }
  };
};

export const crearBanner = (datos) => {
  return async function (dispatch) {
    const response = await axios.post(`${API_URL}/banner`, datos);
    await dispatch(getBannersAdmin());
    return response.data;
  };
};

export const actualizarBanner = (id, datos) => {
  return async function (dispatch) {
    const response = await axios.put(`${API_URL}/banner/${id}`, datos);
    await dispatch(getBannersAdmin());
    return response.data;
  };
};

export const eliminarBanner = (id) => {
  return async function (dispatch) {
    const response = await axios.delete(`${API_URL}/banner/${id}`);
    await dispatch(getBannersAdmin());
    return response.data;
  };
};

// Configuración de marca (colores + nombre de tienda). Se pide una
// vez al cargar el sitio y se usa para pintar las variables CSS de
// Design-system.css, así cada instalación puede tener su propia
// identidad sin tocar código.

export const getConfiguracion = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/configuracion`);

      dispatch({
        type: GET_CONFIGURACION,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
    }
  };
};

export const actualizarConfiguracion = (datos) => {
  return async function (dispatch) {
    const response = await axios.put(`${API_URL}/configuracion`, datos);

    dispatch({
      type: GET_CONFIGURACION,
      payload: response.data,
    });

    return response.data;
  };
};