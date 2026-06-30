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
import dashboardStyles from "./panelAdminDashboard.module.css";
import TicketPage from "./pedidos/TicketPage";

const menuItems = [
  {
    title: "Inicio",
    path: "/admin/principal",
    icon: "📊",
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
    title: "Banners",
    path: "/admin/banners",
    icon: "🖼️",
  },
];

const PanelAdmin = () => {
  // null = todavía no sabemos (estamos verificando contra el backend)
  // true / false = resultado confirmado de la verificación
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

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

    const password = event.target.elements.password.value;

    try {
      const result = await dispatch(LoginAdmin(password));

      if (!result?.success) {
        setLoginError(result?.error || "Contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Error al iniciar sesión");
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

  return (
    <div className={dashboardStyles.dashboardContainer}>
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

        {!isLoggedIn && (
          <div
            className={dashboardStyles.modalIniAdm}
          >
            <div
              className={
                dashboardStyles.modalContentIniAdm
              }
            >
              <h2>Iniciar sesión</h2>

              <form
                onSubmit={handleLogin}
                autoComplete="off"
              >
                <label
                  className={
                    dashboardStyles.inputLabel
                  }
                >
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  className={
                    dashboardStyles.inputPassword
                  }
                  placeholder="Contraseña"
                />

                {loginError && (
                  <p style={{ color: "red", margin: "0.5rem 0" }}>
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    dashboardStyles.loginButton
                  }
                >
                  Iniciar sesión
                </button>
              </form>
            </div>
          </div>
        )}

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
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default PanelAdmin;