# Tienda online (e-commerce a medida)

Plataforma de tienda online lista para vender: catálogo con variantes (talle/color/stock), carrito, checkout con Mercado Pago o coordinación por WhatsApp, cálculo de envíos, cupones, y un panel de administración completo con editor de diseño sin código.

Monorepo con dos partes:

- `server/` — API REST (Node.js + Express + Sequelize + PostgreSQL).
- `vite-project/` — sitio público + panel de administración (React + Vite + Redux).

---

## Stack

- **Backend:** Node.js, Express, Sequelize, PostgreSQL, JWT, Cloudinary (imágenes), Mercado Pago, Nodemailer (correos).
- **Frontend:** React 18, Vite, Redux + Thunk, React Router.

---

## Puesta en marcha (desarrollo local)

Requisitos: Node.js 18+, una base PostgreSQL, y cuentas de Cloudinary y Mercado Pago (para imágenes y cobros).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # completá los valores reales (ver abajo)
npm run dev               # levanta con nodemon
```

### 2. Frontend

```bash
cd vite-project
npm install
cp .env.example .env      # setea VITE_API_URL apuntando al backend
npm run dev               # http://localhost:5173
```

---

## Variables de entorno

Cada carpeta tiene un `.env.example` con todas las variables documentadas. Resumen de las imprescindibles:

**Backend (`server/.env`):**

- `DATABASE_URL` — conexión a PostgreSQL.
- `SECRET_KEY` — clave para firmar los JWT (larga y aleatoria).
- `ADMIN_PASSWORD_HASH` o `ADMIN_PASSWORD` — acceso al panel admin.
- `CLIENT_URL` — dominio(s) del frontend permitidos por CORS.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — imágenes.
- `ACCESS_TOKEN` / `MP_PUBLIC_KEY` / `MP_WEBHOOK_URL` / `MP_WEBHOOK_SECRET` — Mercado Pago.
- `EMAIL_USER` / `EMAIL_PASS` — correos de aviso de pedido/envío.

**Frontend (`vite-project/.env`):**

- `VITE_API_URL` — URL del backend desplegado.

El `.env` nunca se versiona (está en `.gitignore`). En un hosting como Render se cargan desde el panel de Environment, no como archivo.

---

## Deploy (resumen)

1. **Base de datos:** crear una instancia PostgreSQL (Render, Neon, Supabase).
2. **Backend:** desplegar `server/` como Web Service (build `npm install`, start `npm start`). Cargar todas las variables de entorno.
3. **Frontend:** build `npm run build` (genera `dist/`), servirlo como sitio estático o con `npm start` (usa `serve`). Setear `VITE_API_URL` con la URL real del backend antes del build.
4. **Mercado Pago:** configurar el webhook apuntando a `<backend>/mp/webhook`.

---

## Primer arranque

1. Iniciar sesión en el panel: `/admin/login` con la contraseña de `ADMIN_PASSWORD`.
2. Completar **Diseño → Identidad y colores** (nombre, logo, colores, contacto). Hasta cargarlo, se ven textos genéricos de respaldo.
3. Cargar categorías y productos.
4. Configurar envíos y, si se usa, revisar las credenciales de Mercado Pago.

Todo lo visual (colores, tipografía, secciones de la portada, plantillas) se maneja desde el panel, sin tocar código.

---

## Tests

Ambas partes usan Vitest:

```bash
cd server && npm test
cd vite-project && npm test
```
