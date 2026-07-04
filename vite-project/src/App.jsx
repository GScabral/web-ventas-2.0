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
// import Landing from './pages/landing/landing'
// import NewUser from './CC/crearCuenta'
// import Ingresar from './IS/iniciarSesion'
// import Fav from './pages/Home/fav/fav'
// import Ofertas from './pages/Home/ofertas/ofertas'
// import PagAccesorios from './pages/Home/accesorios/pagAccesorios'
// import PagMaquillaje from './pages/Home/maquillaje/PagMaquillaje'
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
  const hideNav = location.pathname === '/newUser' ||
    location.pathname === '/iniciar' ||
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
          {/* <Route path='/newUser' element={<NewUser />} />
          <Route path='/iniciar' element={<Ingresar />} /> */}
          {/* <Route path='/Favorito' element={<Fav />} /> */}
          {/* <Route path='/Ofertas' element={<Ofertas />} /> */}
          {/* <Route path='/Accesorios' element={<PagAccesorios />} /> */}
          {/* <Route path='/VentaPorMayor' element={<VentaPorMayor />} /> */}
          {/* <Route path='/Maquillaje' element={<PagMaquillaje />} /> */}
        </Routes>
      </Suspense>

    </div>
  )

}

export default App