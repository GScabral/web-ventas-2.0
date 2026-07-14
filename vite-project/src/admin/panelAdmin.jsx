import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  Route,
  Routes,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LoginAdmin, logoutAdmin, verifyAdminToken } from "../redux/action";

// Cada sección se carga sola, cuando el admin entra a esa pantalla
// puntual — así abrir /admin no descarga de una las 12 secciones
// (Caja, Cupones, Papelera, etc.), solo el shell (sidebar/header) y
// la que realmente se está mirando.
const NewProduct = lazy(() => import("./añadir/añadirProducto"));
const Principal = lazy(() => import("./inicio/principalAdmin"));
const ProductList = lazy(() => import("./productos/listadoProductos"));
const PedidoList = lazy(() => import("./pedidos/listadoPedidos"));
const ClienteList = lazy(() => import("./clientes/listadoClientes"));
const OfertasLista = lazy(() => import("./ofertas/listadoOFertas"));
const BannersLista = lazy(() => import("./banners/listadoBanners"));
const Caja = lazy(() => import("./caja/Caja"));
const Cupones = lazy(() => import("./cupones/Cupones"));
const Papelera = lazy(() => import("./papelera/Papelera"));
const Envios = lazy(() => import("./envios/Envios"));
const TicketPage = lazy(() => import("./pedidos/TicketPage"));
const Diseno = lazy(() => import("./diseno/Diseno"));

// Estas dos SÍ se cargan siempre de una: BusquedaGlobal está montada
// en todo momento (escucha Ctrl/Cmd+K en cualquier pantalla) y
// LoginScreen es lo primero que hay que mostrar si no hay sesión, así
// que no tiene sentido diferirla.
import BusquedaGlobal from "./BusquedaGlobal";
import LoginScreen from "./login/LoginScreen";
import dashboardStyles from "./panelAdminDashboard.module.css";

// Antes era una lista plana de 12 items — costaba encontrar algo a
// simple vista. Agrupado por lo que el admin realmente viene a hacer:
// cargar/gestionar productos, atender ventas, o tocar cómo se ve la
// tienda. "Inicio" queda suelto arriba de todo, es el punto de partida,
// no pertenece a ningún grupo temático.
const menuGroups = [
  {
    titulo: null,
    items: [
      { title: "Inicio", path: "/admin/principal", icon: "📊", subtitulo: "Un vistazo rápido a cómo viene el día" },
    ],
  },
  {
    titulo: "Catálogo",
    items: [
      { title: "Añadir Producto", path: "/admin/new", icon: "➕", subtitulo: "Cargá un producto nuevo" },
      { title: "Inventario", path: "/admin/lista", icon: "📦", subtitulo: "Todos tus productos, stock y precios" },
      { title: "Papelera", path: "/admin/papelera", icon: "🗑️", subtitulo: "Productos eliminados, por si hay que recuperarlos" },
      { title: "Ofertas", path: "/admin/ofertas", icon: "🏷️", subtitulo: "Productos con descuento activo" },
    ],
  },
  {
    titulo: "Ventas",
    items: [
      { title: "Caja", path: "/admin/caja", icon: "💰", subtitulo: "Registrá entradas y salidas de efectivo" },
      { title: "Pedidos", path: "/admin/PedidosLista", icon: "🛒", subtitulo: "Seguimiento de compras, de nuevo a entregado" },
      { title: "Clientes", path: "/admin/clientes", icon: "👥", subtitulo: "Quiénes te compraron y sus datos" },
      { title: "Cupones", path: "/admin/cupones", icon: "🎟️", subtitulo: "Códigos de descuento para el checkout" },
    ],
  },
  {
    titulo: "Tienda",
    items: [
      { title: "Banners", path: "/admin/banners", icon: "🖼️", subtitulo: "La tira de imágenes arriba del catálogo" },
      { title: "Envíos", path: "/admin/envios", icon: "🚚", subtitulo: "Costos y zonas de entrega" },
      { title: "Diseño", path: "/admin/diseno", icon: "🎨", subtitulo: "Identidad, secciones de la portada y plantillas" },
    ],
  },
];

// Versión plana, derivada de los grupos, para buscar rápido el
// título/subtítulo del header a partir de la ruta actual.
const menuItems = menuGroups.flatMap(g => g.items);

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

  // Título/subtítulo del header según la ruta activa, en vez del
  // genérico fijo de siempre — así el header confirma en qué sección
  // estás parado, no solo el sidebar (útil sobre todo en mobile,
  // donde el sidebar queda escondido la mayor parte del tiempo).
  const location = useLocation();
  const seccionActual = menuItems.find(item => item.path === location.pathname);

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
          {menuGroups.map((grupo, i) => (
            <div className={dashboardStyles.menuGroup} key={grupo.titulo || `grupo-${i}`}>
              {grupo.titulo && (
                <span className={dashboardStyles.menuGroupLabel}>{grupo.titulo}</span>
              )}
              {grupo.items.map((item) => (
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
            </div>
          ))}
        </nav>
      </aside>

      <main className={dashboardStyles.mainContent}>
        <header className={dashboardStyles.header}>
          <div>
            <h1 className={dashboardStyles.headerTitle}>
              {seccionActual?.title || "Panel de Administración"}
            </h1>

            <p className={dashboardStyles.headerSubtitle}>
              {seccionActual?.subtitulo || "Gestión de productos, pedidos y clientes"}
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
          <Suspense fallback={<p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Cargando...</p>}>
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
              path="/clientes"
              element={
                isLoggedIn ? (
                  <ClienteList />
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

            {/* Ruta vieja: "Personalización" se unificó dentro de
                "Diseño" (pestaña "Identidad y colores"). Se deja el
                redirect por si alguien tiene el link guardado. */}
            <Route
              path="/personalizacion"
              element={<Navigate to="/admin/diseno" />}
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

            <Route
              path="/diseno"
              element={
                isLoggedIn ? (
                  <Diseno />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
          </Routes>
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default PanelAdmin;