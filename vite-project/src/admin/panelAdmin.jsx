import React, { useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LoginAdmin } from "../redux/action";

import NewProduct from "./añadir/añadirProducto";
import Principal from "./inicio/principalAdmin";
import ProductList from "./productos/listadoProductos";
import PedidoList from "./pedidos/listadoPedidos";
// import ClienteList from "./clientes/listadoClientes";
import OfertasLista from "./ofertas/listadoOFertas";
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
];

const PanelAdmin = () => {
  const [showModal, setShowModal] = useState(!Boolean(localStorage.getItem('adminToken')));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.isLoggedInAd) || Boolean(localStorage.getItem('adminToken'));

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    const password = event.target.elements.password.value;

    try {
      const result = await dispatch(LoginAdmin(password));

      if (result?.success) {
        setShowModal(false);
      } else {
        alert("Contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className={dashboardStyles.dashboardContainer}>
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
          >
            ☰
          </button>
        </header>

        {showModal && !isLoggedIn && (
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
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default PanelAdmin;