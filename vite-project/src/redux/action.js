
import axios from "axios";
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
export const DESPACHAR_PRODUCTO = 'DESPACHAR_PRODUCTO';
export const OFERTA = "OFERTA";
export const BORRAR_OFERTA = "BORRAR_OFERTA";
export const ENVIAR_ESTADO = 'ENVIAR_ESTADO';
export const GET_OFERTAS = "GET_OFERTAS";

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

//PEDidos
export const PEDIDO = "PEDIDO";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getProductos = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`https://web-ventas-2-0.onrender.com/producto/producto`);


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
      const response = await axios.get(`https://web-ventas-2-0.onrender.com/cliente/allClientes`)

      dispatch({
        type: GET_CLIENTES,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const getPedidos = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`https://web-ventas-2-0.onrender.com/pedido/Lpedidos`)
      dispatch({
        type: GET_PEDIDOS,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const addProduct = (formData) => {
  for (let pair of formData.entries()) {
  }

  return async function (dispatch) {
    try {


      const response = await axios.post(`https://web-ventas-2-0.onrender.com/producto/nuevoProducto`, formData);

      dispatch({
        type: ADD_PRODUCT,
        payload: response.data, // Puedes ajustar esto dependiendo de la estructura de datos devuelta por el servidor
      });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Código de estado HTTP:', error.response.status);
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
      console.error('Error completo:', error.config);
    }
  };
};

export const getById = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`https://web-ventas-2-0.onrender.com/producto/ProductoId/${id}`);

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
      const response = await axios.post(`https://web-ventas-2-0.onrender.com/cliente/nuevoCliente`, userData);
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


      const response = await axios.post(`https://web-ventas-2-0.onrender.com/cliente/login`, userData);



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
      const response = await axios.post(`https://web-ventas-2-0.onrender.com/cliente/InfoUsuario`, { correo, contraseña });

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
      const response = await axios.get(`https://web-ventas-2-0.onrender.com/cliente/cliente/${id}`);

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
      const response = await axios.patch(`https://web-ventas-2-0.onrender.com/Nadmin/cambioAdmin/${id}`, datosProducto);
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

export const borrar = async (id) => {
  try {

    const borrar = await axios.delete(`https://web-ventas-2-0.onrender.com/producto/eliminar/${id}`)

    if (borrar.status !== 200) {
      throw new Error('Error al obtener el cliente por ID');
    }

    dispatch({
      type: BORRAR_PRODUCTO,
      payload: borrar.data,
    });
  } catch (error) {
    console.error('Error :', error);
  }
};

export const addPedido = (productos) => {

  return async function () {
    try {
      const response = await axios.post('https://web-ventas-2-0.onrender.com/pedido/nuevoPedido', {
        productos: productos,
      });

      return response; // Devuelve la respuesta del servidor
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export const actualizarVariante = (id, cantidad_disponible) => { // Asegúrate de pasar cantidad_disponible aquí
  return async function (dispatch) {
    try {

      const response = await axios.patch(`https://web-ventas-2-0.onrender.com/producto/cambio/${id}`, {
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

export const actualizarCarrito = (nuevoCarrito) => ({
  type: ACTUALIZAR_CARRITO,
  payload: nuevoCarrito,
});


export const buscar = (name) => {
  return async function (dispatch) {
    try {

      const response = await axios.get(`https://web-ventas-2-0.onrender.com/producto/name/${name}`);

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

export const despacharProducto = (pedidoId, detalleId) => {
  return {
    type: DESPACHAR_PRODUCTO,
    payload: { pedidoId, detalleId }
  };
};

export const enviarCorreo = (idPedido, infoPedido, correo) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "https://web-ventas-2-0.onrender.com/Nadmin/confirmacionPedido",
        {
          idPedido,
          infoPedido,
          correo,
        }
      );

      // opcional: despachar acción si quieres guardar algo en Redux
      dispatch({
        type: "ENVIAR_CORREO_EXITO",
        payload: response.data,
      });

      return response; // 👈 MUY IMPORTANTE devolver la respuesta
    } catch (error) {
      console.error("Error al enviar el correo:", error);

      // opcional: despachar acción de error
      dispatch({
        type: "ENVIAR_CORREO_ERROR",
        payload: error,
      });

      throw error; // 👈 para que el componente pueda capturarlo en el try/catch
    }
  };
};


export const LoginAdmin = (password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('https://web-ventas-2-0.onrender.com/Nadmin/loginc', {
        password: password,
      });
      dispatch({ type: 'ADMIN_LOGIN_SUCCESS' });
      return response;
    } catch (error) {
      console.error(error);
      dispatch({ type: 'ADMIN_LOGIN_FAILURE', payload: { error: error.message } });
      throw error;
    }
  };
};

export const ofertas = (oferta) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('https://web-ventas-2-0.onrender.com/oferta/nuevaOferta', {
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
      const response = await axios.get('https://web-ventas-2-0.onrender.com/oferta/ofertas');

      dispatch({
        type: GET_OFERTAS,
        payload: response.data,
      });

    } catch (error) {
      console.error('Error al obtener ofertas activas:', error); // Mostrar error específico
    }
  };
};


export const borrarOferta = async (id) => {
  try {

    const borrar = await axios.delete(`https://web-ventas-2-0.onrender.com/oferta/eliminar/${id}`)

    if (borrar.status !== 200) {
      throw new Error('Error al obtener el cliente por ID');
    }

    dispatch({
      type: BORRAR_OFERTA,
      payload: borrar.data,
    });
  } catch (error) {
    console.error('Error :', error);
  }
};



