import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/home'
// import Landing from './pages/landing/landing'
import PanelAdmin from './admin/panelAdmin'
import Detail from './pages/Home/Detail/detail'
import NewUser from './CC/crearCuenta'
import Ingresar from './IS/iniciarSesion'
import MetodoPago from './pages/Home/Detail/mp'
import Carrito from './pages/Home/carrito/carrito'
import Fav from './pages/Home/fav/fav'
import Nav from './pages/Home/Nav/Nav'
import Principal from './admin/inicio/principalAdmin'
import NewProduct from './admin/añadir/añadirProducto'
import ProductList from './admin/productos/listadoProductos'
import DevolucionCambio from './pages/Home/devolucion/devolucion'
import Ofertas from './pages/Home/ofertas/ofertas'

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
        <Route path='/newUser' element={<NewUser />} />
        <Route path='/iniciar' element={<Ingresar />} />
        <Route path='/DevolucionCambio' element={<DevolucionCambio />} />
        <Route path='/comoPagar' element={<MetodoPago />} />
        <Route path='/carrito' element={<Carrito />} />
        <Route path='/Favorito' element={<Fav />} />
        <Route path='/Ofertas' element={<Ofertas />} />
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
