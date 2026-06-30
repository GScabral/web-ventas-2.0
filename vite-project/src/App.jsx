import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/home'
import PanelAdmin from './admin/panelAdmin'
import Detail from './pages/Home/Detail/detail'
import Carrito from './pages/Home/carrito/carrito'
import Nav from './pages/Home/Nav/Nav'
import Principal from './admin/inicio/principalAdmin'
import NewProduct from './admin/añadir/añadirProducto'
import ProductList from './admin/productos/listadoProductos'
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

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/newUser' ||
    location.pathname === '/iniciar' ||
    location.pathname === '/carrito' ||
    /^\/detail\/\d+$/.test(location.pathname) ||
    location.pathname.startsWith('/admin');


  return (
    <div>
      {!hideNav && <Nav />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
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

    </div>
  )

}


const AdminRoutes = () => {
  return (
    <PanelAdmin>
      {/* Actualiza las rutas internas para que coincidan con el patrón de la ruta del padre */}
      <Route path="principal" element={<Principal />} />
      <Route path="new" element={<NewProduct />} />
      <Route path="lista" element={<ProductList />} />
    </PanelAdmin>
  );
};
export default App