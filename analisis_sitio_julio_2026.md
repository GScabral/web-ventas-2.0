# Análisis completo del sitio — julio 2026

Revisión de código (frontend, backend, DB) y navegación en vivo del sitio deployado (`web-ventas-2-0-3.onrender.com`, público + admin). Todo lo listado abajo está confirmado — o reproducido en vivo, o verificado leyendo el código real, no supuesto.

Antes de la lista: el sitio está en mejor estado del que esperaba para una tienda demo. CORS, helmet, rate limiting en login de admin, bcrypt, validación de stock por talle/color, y el sistema de Diseño que armamos hoy ya están andando en producción sin errores de consola. Lo que sigue es lo que le falta para estar realmente pulido.

---

## 🔴 Prioridad alta

**1. Sin protección contra fuerza bruta en login/registro de clientes.**
El login de admin tiene rate limiting (10 intentos / 15 min). El login y registro de clientes (`/cliente/login`, `/cliente/nuevoCliente`) no tienen ninguno — alguien puede probar contraseñas en bucle sin freno.

**2. El sitio confirma si un email está registrado.**
`GET /cliente/check?correo=x` devuelve explícitamente si ese correo ya tiene cuenta. Combinado con el punto anterior (sin límite de intentos), cualquiera puede armar una lista de emails de clientes reales probando uno por uno.

**3. El login de cliente también revela si el email existe.**
Mensajes distintos: "El correo electrónico es incorrecto" vs. "La contraseña es incorrecta". Debería ser un mensaje genérico único ("Correo o contraseña incorrectos") para no dar esa pista.

**4. Lógica de admin mezclada dentro del login de cliente.**
En `INS.js` (login de clientes), hay una rama que chequea `correo === ADMIN_EMAIL && contraseña === ADMIN_PASSWORD` y emite un token con `isAdmin: true`. El admin ya tiene su propio flujo de login separado — esta rama es código muerto/confuso que no debería vivir ahí; mezclar los dos dominios de auth es una fuente de errores futuros.

**5. `GET /InfoUsuario` manda la contraseña en el body de un GET.**
No es RESTful (los GET no deberían llevar body — muchos proxies/clientes lo descartan) y aumenta el riesgo de que la contraseña en texto plano termine en algún log. Debería ser POST.

**6. Imagen principal inconsistente entre la grilla y el detalle de producto.**
Confirmado en vivo: la tarjeta de "[DEMO] Campera Denim Oversize" en la grilla y el carrito muestra una imagen, pero al entrar al detalle del mismo producto se abre mostrando otra imagen distinta como principal. Es una inconsistencia visual real que un cliente va a notar.

---

## 🟡 Prioridad media

**7. El catálogo completo se descarga siempre, sin paginación en el servidor.**
`getProductos()` (el endpoint que alimenta Home, Catálogo y el admin de Inventario) trae **todos** los productos con todas sus variantes e imágenes en una sola respuesta, sin límite. Hoy con ~20 productos no se nota. Con 300 productos, esa respuesta va a pesar varios MB y va a tardar en cargar cualquier página que muestre productos.

**8. Los filtros de categoría/precio no reducen lo que se descarga.**
Se aplican del lado del cliente sobre el catálogo ya descargado — filtrar no ahorra ancho de banda, solo esconde tarjetas ya cargadas.

**9. Todas las páginas comparten el mismo título y descripción.**
No hay meta tags dinámicos por página: la portada, un producto puntual y la página de ofertas tienen exactamente el mismo `<title>` y `<meta description>`. Para SEO y para que Google indexe bien cada producto, cada página debería tener su propio título/descripción.

**10. Sin Open Graph — compartir un producto por WhatsApp no muestra su imagen.**
Como el checkout de esta tienda es WhatsApp-first, esto pesa: cuando un cliente comparte el link de un producto, la vista previa no muestra ni la imagen ni el nombre real del producto (usa lo genérico del sitio).

**11. Sin `sitemap.xml` ni `robots.txt`.**
Ninguno de los dos existe hoy. Sin sitemap, a Google le cuesta más descubrir todas las páginas de producto.

**12. Imágenes sin carga diferida (`loading="lazy"`).**
Ningún `<img>` del sitio usa el atributo nativo de lazy loading — todas las imágenes de una página (grilla completa, secciones) se piden de una, aunque estén fuera de pantalla.

**13. La Home puede quedar sin ningún `<h1>`.**
Con la configuración por defecto (hero oculto), ninguna sección de la portada usa `<h1>` — todo arranca en `<h2>`. Un `<h1>` por página es una señal básica de SEO/accesibilidad que hoy puede faltar.

**14. Es una SPA sin server-side rendering.**
Los buscadores modernos ejecutan JavaScript, pero con presupuesto limitado — para una tienda que depende de que Google indexe bien cada producto, esto es una limitación de fondo del stack (React + Vite puro), no algo que se arregle con un cambio chico. Lo dejo anotado como algo a evaluar a futuro, no como una tarea de esta semana.

---

## 🟢 Prioridad baja / pulido

**15. Sin tests automatizados.** Ni en frontend ni en backend hay ningún test — todo el control de calidad depende de probar a mano.

**16. Archivos huérfanos todavía sin borrar.** `hero.jsx` (el componente viejo, reemplazado hoy por la nueva sección Hero), `carrusel.jsx` y `adminCarrusel.jsx` siguen en el repo sin que nada los importe.

**17. `console.log` sueltos en 3 archivos del admin** (`pedidoCardList.jsx`, `TicketPage.jsx`, `Caja.jsx`).

**18. Categorías demo duplicadas.** "Pantalon" y "Pantalones" existen como dos categorías separadas en los datos de prueba — a corregir cuando se cargue catálogo real.

**19. Contraseñas de cliente sin reglas de complejidad.** Solo se exige un mínimo de 6 caracteres, sin combinación de mayúsculas/números. Aceptable para una tienda chica, pero es fácil de subir un poco.

**20. Layout del detalle de producto con mucho espacio vacío en pantallas anchas.** En monitores grandes, la columna de info (talle/color/cantidad/botón) deja un hueco grande debajo, sin contenido que lo llene (por ejemplo, una sección de "también te puede interesar").

---

## Lo que ya funciona bien (verificado en vivo)

- Validación de stock por combinación talle+color (probado con 0 unidades disponibles: bloquea correctamente).
- Carrito, checkout con WhatsApp y Mercado Pago, cálculo de envío.
- CORS, helmet, rate limiting en login admin, hashing de contraseñas con bcrypt.
- Sistema de Diseño (secciones, plantillas, plantillas personalizadas) deployado y sin errores de consola — la migración SQL ya está corrida.
- Accesibilidad básica del Nav: todos los íconos (buscar, cuenta, carrito, menú) ya tienen `aria-label`.
