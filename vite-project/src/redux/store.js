import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer'; // Asegúrate de importar tu combinador de reducers aquí
import { ACTUALIZAR_CARRITO, restaurarSesionCliente } from './action';

// Persistencia simple del carrito en localStorage: sin esto, cualquier
// refresh de página (o cerrar y volver a abrir la pestaña) vaciaba el
// carrito por completo, porque vivía solo en memoria (estado de Redux).
const CARRITO_STORAGE_KEY = "tienda_carrito";

function cargarCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CARRITO_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : null;
  } catch (error) {
    console.error("No se pudo leer el carrito guardado:", error);
    return null;
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

// Hidratar el carrito guardado, si hay uno, apenas arranca la app.
// Se reutiliza ACTUALIZAR_CARRITO (ya existía en el reducer) en vez de
// tocar el initialState, para no arriesgar romper el resto de los
// campos del estado inicial.
const carritoGuardado = cargarCarritoGuardado();

if (carritoGuardado && carritoGuardado.length > 0) {
  store.dispatch({ type: ACTUALIZAR_CARRITO, payload: carritoGuardado });
}

// Restaurar la sesión de cliente (si había una guardada), por el mismo
// motivo que el carrito: antes un simple F5 dejaba al cliente
// deslogueado sin ningún aviso.
store.dispatch(restaurarSesionCliente());

// Guardar el carrito cada vez que cambie (agregar, sacar, vaciar).
let carritoAnterior = store.getState().carrito;

store.subscribe(() => {
  const carritoActual = store.getState().carrito;

  if (carritoActual !== carritoAnterior) {
    carritoAnterior = carritoActual;

    try {
      localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carritoActual));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }
});

export default store;
