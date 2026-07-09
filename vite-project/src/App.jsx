import React, { Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/home'
import Detail from './pages/Home/Detail/detail'
import Carrito from './pages/Home/carrito/carrito'
import Nav from './pages/Home/Nav/Nav'
import ThemeLoader from './componentes/ThemeLoader'
import Toast from './componentes/Toast'
import DevolucionCambio from './pages/Home/devolucion/devolucion'
import Catalogo from './pages/Home/temporada/Catalogo'
import CrearCuenta from './pages/cuenta/crearCuenta'
import IniciarSesion from './pages/cuenta/iniciarSesion'
import MiCuenta from './pages/cuenta/miCuenta'
import Ofertas from './pages/Home/ofertas/ofertas'
import PagoResultado from './pages/Home/pago/PagoResultado'
// VentaPorMayor.jsx hoy es solo un título de prueba sin contenido real
// (sin formulario, sin info de contacto). Cuando tenga contenido de
// verdad, descomentar este import y la ruta de abajo.
// import VentaPorMayor from './pages/Home/VentaPorMayor/VentaPorMayor'

// El panel de administración (11 secciones: productos, pedidos, caja,
// cupones, papelera, envíos, personalización...) se carga en un
// archivo aparte, separado del que descarga cualquiera que entra a
// comprar. Antes esto NO pasaba: PanelAdmin se importaba directo acá
// arriba, así que un cliente comprando una remera terminaba
// descargando también todo el código de gestión de caja y cupones sin
// necesitarlo nunca.
const PanelAdmin = React.lazy(() => import('./admin/panelAdmin'));

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/crear-cuenta' ||
    location.pathname === '/iniciar-sesion' ||
    location.pathname === '/carrito' ||
    /^\/detail\/\d+$/.test(location.pathname) ||
    location.pathname.startsWith('/admin');


  return (
    <div>
      <ThemeLoader />
      <Toast />
      {!hideNav && <Nav />}
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin/*' element={<PanelAdmin />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path='/DevolucionCambio' element={<DevolucionCambio />} />
          <Route path='/carrito' element={<Carrito />} />
          <Route path='/catalogo' element={<Catalogo />} />
          <Route path='/crear-cuenta' element={<CrearCuenta />} />
          <Route path='/iniciar-sesion' element={<IniciarSesion />} />
          <Route path='/mi-cuenta' element={<MiCuenta />} />
          <Route path='/ofertas' element={<Ofertas />} />
          <Route path='/pago-exitoso' element={<PagoResultado />} />
          <Route path='/pago-fallido' element={<PagoResultado />} />
          <Route path='/pago-pendiente' element={<PagoResultado />} />
          {/* <Route path='/VentaPorMayor' element={<VentaPorMayor />} /> */}
        </Routes>
      </Suspense>

    </div>
  )

}

export default App