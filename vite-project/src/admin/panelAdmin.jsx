import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LoginAdmin, logoutAdmin, verifyAdminToken } from "../redux/action";

import NewProduct from "./añadir/añadirProducto";
import Principal from "./inicio/principalAdmin";
import ProductList from "./productos/listadoProductos";
import PedidoList from "./pedidos/listadoPedidos";
// import ClienteList from "./clientes/listadoClientes";
import OfertasLista from "./ofertas/listadoOFertas";
import BannersLista from "./banners/listadoBanners";
import Personalizacion from "./personalizacion/Personalizacion";
import Caja from "./caja/Caja";
import Cupones from "./cupones/Cupones";
import Papelera from "./papelera/Papelera";
import Envios from "./envios/Envios";
import BusquedaGlobal from "./BusquedaGlobal";
import LoginScreen from "./login/LoginScreen";
import dashboardStyles from "./panelAdminDashboard.module.css";
import TicketPage from "./pedidos/TicketPage";

const menuItems = [
  {
    title: "Inicio",
    path: "/admin/principal",
    icon: "📊",
  },
  {
    title: "Caja",
    path: "/admin/caja",
    icon: "💰",
  },
  {
    title: "Añadir Producto",
    path: "/admin/new",
    icon: "➕",
  },
  {
    title: "Inventario",
    path: "/admin/lista",
    icon: "📦",
  },
  {
    title: "Papelera",
    path: "/admin/papelera",
    icon: "🗑️",
  },
  {
    title: "Pedidos",
    path: "/admin/PedidosLista",
    icon: "🛒",
  },
  // {
  //   title: "Clientes",
  //   path: "/admin/clientes",
  //   icon: "👥",
  // },
  {
    title: "Ofertas",
    path: "/admin/ofertas",
    icon: "🏷️",
  },
  {
    title: "Cupones",
    path: "/admin/cupones",
    icon: "🎟️",
  },
  {
    title: "Banners",
    path: "/admin/banners",
    icon: "🖼️",
  },
  {
    title: "Envíos",
    path: "/admin/envios",
    icon: "🚚",
  },
  {
    title: "Personalización",
    path: "/admin/personalizacion",
    icon: "🎨",
  },
];

const PanelAdmin = () => {
  // null = todavía no sabemos (estamos verificando contra el backend)
  // true / false = resultado confirmado de la verificación
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const isLoggedIn = useSelector((state) => state.isLoggedInAd);

  const dispatch = useDispatch();

  // Al montar el panel, no confiamos en que haya un adminToken en localStorage:
  // lo confirmamos contra el backend. Si venció o es inválido, se limpia solo
  // y se vuelve a pedir contraseña.
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(verifyAdminToken());
      setCheckingAuth(false);
    };
    checkAuth();
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    const password = event.target.elements.password.value;

    try {
      const result = await dispatch(LoginAdmin(password));

      if (!result?.success) {
        setLoginError(result?.error || "Contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Error al iniciar sesión");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  // Mientras confirmamos contra el backend si el token guardado es válido,
  // no mostramos ni el panel ni el modal de login para evitar parpadeos
  // o dejar ver contenido admin antes de confirmar la sesión.
  if (checkingAuth) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <main className={dashboardStyles.mainContent}>
          <p style={{ padding: "2rem", textAlign: "center" }}>
            Verificando sesión...
          </p>
        </main>
      </div>
    );
  }

  // Pantalla propia de login, no un modal flotando sobre el panel
  // vacío: así el admin ni siquiera ve el sidebar/header hasta estar
  // autenticado.
  if (!isLoggedIn) {
    return (
      <div className={dashboardStyles.dashboardContainer}>
        <LoginScreen
          onSubmit={handleLogin}
          loginError={loginError}
          loading={loggingIn}
        />
      </div>
    );
  }

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <BusquedaGlobal />

      {isSidebarOpen && (
        <div
          className={dashboardStyles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`${dashboardStyles.sidebar}
        ${isSidebarOpen
            ? dashboardStyles.sidebarOpen
            : ""
          }`}
      >
        <div className={dashboardStyles.logo}>
          🛍️ Admin Panel
        </div>

        <nav className={dashboardStyles.menu}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `${dashboardStyles.menuButton}
                ${isActive
                  ? dashboardStyles.active
                  : ""
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={dashboardStyles.mainContent}>
        <header className={dashboardStyles.header}>
          <div>
            <h1 className={dashboardStyles.headerTitle}>
              Panel de Administración
            </h1>

            <p className={dashboardStyles.headerSubtitle}>
              Gestión de productos, pedidos y clientes
            </p>
          </div>

          <button
            className={dashboardStyles.mobileMenu}
            onClick={() =>
              setIsSidebarOpen(!isSidebarOpen)
            }
            aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isSidebarOpen ? "×" : "☰"}
          </button>

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className={`${dashboardStyles.loginButton} ${dashboardStyles.logoutBtn}`}
            >
              Cerrar sesión
            </button>
          )}
        </header>

        <section className={dashboardStyles.contentCard}>
          <Routes>
            <Route
              path="/principal"
              element={
                isLoggedIn ? (
                  <Principal />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/new"
              element={
                isLoggedIn ? (
                  <NewProduct />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/lista"
              element={
                isLoggedIn ? (
                  <ProductList />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/PedidosLista"
              element={
                isLoggedIn ? (
                  <PedidoList />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/ticket/:id"
              element={
                isLoggedIn ? (
                  <TicketPage />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/ofertas"
              element={
                isLoggedIn ? (
                  <OfertasLista />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/banners"
              element={
                isLoggedIn ? (
                  <BannersLista />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/cupones"
              element={
                isLoggedIn ? (
                  <Cupones />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/papelera"
              element={
                isLoggedIn ? (
                  <Papelera />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/envios"
              element={
                isLoggedIn ? (
                  <Envios />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/personalizacion"
              element={
                isLoggedIn ? (
                  <Personalizacion />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="/caja"
              element={
                isLoggedIn ? (
                  <Caja />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default PanelAdmin;