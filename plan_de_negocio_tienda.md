# Plan de negocio: agencia de e-commerce a medida (con ingreso recurrente)

**Fecha:** 13 de julio de 2026
**Punto de partida:** una plataforma de e-commerce completa y funcionando (catálogo con variantes de talle/color, carrito, checkout con Mercado Pago, envíos, cupones, panel de admin con diseño 100% personalizable sin tocar código).
**Recursos disponibles:** tiempo, prácticamente sin capital para invertir (ver actualización en el punto 6: el modelo cambió para que seas vos quien maneja el hosting, así que necesitás una tarjeta para pagar montos chicos y recurrentes — no una inversión real).

> **Actualización:** la versión original de este plan asumía que cada comercio creaba sus propias cuentas de hosting/dominio. Se corrigió: la mayoría de tus clientes no va a saber (ni va a querer aprender) qué es Render o Cloudinary, así que el modelo pasa a ser **vos administrás toda la infraestructura**, y se lo cobrás incluido en la mensualidad. Ver punto 6 para el detalle completo.

---

## 1. Resumen ejecutivo

De los tres caminos posibles con lo que ya tenés armado (venderle esto a comercios reales, convertirlo en un SaaS multi-tienda, o usarlo para vender productos propios), **el más rentable dado tu punto de partida es venderlo como servicio a comercios reales que hoy no tienen web o tienen una mala** — con un cambio clave respecto a un trabajo freelance tradicional: en vez de cobrar una sola vez por armar el sitio y desaparecer, cobrás una mensualidad de mantenimiento/soporte. Eso es lo que hace que este modelo sea "el más rentable a vos": no dependés de conseguir un cliente nuevo cada mes para tener ingresos, construís un ingreso recurrente (MRR) que se acumula.

La razón por la que este camino te conviene más que los otros dos ahora mismo:

- **Vs. SaaS multi-tienda:** hoy la plataforma es de un solo comercio (una base de datos, una configuración). Convertirla en multi-tenant es un proyecto de desarrollo grande aparte — no es algo que puedas monetizar esta semana. Es un camino válido más adelante, no ahora, sin capital y solo con tu tiempo.
- **Vs. tienda propia (retail):** ahí tu ganancia depende de vender ropa (márgenes de producto, stock, logística, marketing) — un negocio totalmente distinto al de programar. Ya tenés la habilidad de desarrollo resuelta; no tiene sentido no capitalizarla.
- **A favor de la agencia productizada:** tu costo marginal por cliente nuevo es bajísimo. La plataforma ya tiene resuelto lo que un desarrollo a medida cobra caro (checkout, Mercado Pago, envíos, panel de diseño sin código). Para un cliente nuevo, básicamente **reconfigurás, no programás** — eso te permite cobrar menos que la competencia y aun así ganar mucho más por hora que si programaras cada sitio desde cero.

---

## 2. El activo con el que arrancás (y por qué importa)

Esto no es un punto menor: la mayoría de la gente que arranca una agencia de webs empieza de cero cada vez. Vos ya resolviste, para *cualquier* comercio de ropa/indumentaria que reclutes, lo siguiente:

- Catálogo con variantes (talle, color), stock por variante, categorías.
- Carrito y checkout con Mercado Pago ya integrado y probado.
- Cálculo de envío (por provincia y por zona de moto/local).
- Cupones de descuento.
- Panel de administración completo: pedidos, clientes, caja, estadísticas.
- **Un editor de diseño sin código**: el dueño del comercio (o vos, en 10 minutos) cambia colores, tipografía, layout de la home, agrega/saca secciones, todo desde un panel — no hay que tocar una línea de código para "rebrandear" el sitio para cada cliente nuevo.

Esto último es la pieza clave del modelo: **onboardear un cliente nuevo es horas, no semanas.**

---

## 3. Cliente ideal (ICP)

Empezá angosto, no amplio. Perfil ideal para las primeras 5-10 ventas:

- Comercio de indumentaria/moda/accesorios con local físico y ventas por Instagram/WhatsApp, **sin sitio propio** (venden solo por redes) o con un sitio viejo/roto/hecho por un sobrino hace 5 años.
- Ya factura (no es un emprendimiento recién arrancado): tiene flujo de caja para pagar una mensualidad.
- Dueño activo en redes (para que valore que el sitio se pueda actualizar solo, sin depender de vos para cada cambio de producto).

Una vez que tengas 3-5 casos de éxito reales, se abre la puerta a otros rubros con el mismo tipo de catálogo (calzado, accesorios, marroquinería, cosmética) sin cambiar nada del producto.

---

## 4. Propuesta de valor (cómo te parás frente a la competencia)

| Alternativa que tiene hoy el comercio | Tu propuesta |
|---|---|
| Solo vender por WhatsApp/Instagram | Catálogo ordenado 24/7, cobro automático con Mercado Pago, sin perseguir cada pedido a mano |
| Tiendanube / plataformas armadas | Vos les armás el sitio *a medida* (su marca, su catálogo), sin las comisiones por venta que cobran algunos planes de Tiendanube, y con un panel de diseño igual de simple |
| Desarrollo a medida con un freelancer/agencia | Mismo resultado (o mejor, ya viene con Mercado Pago y envíos resueltos) por **una fracción del precio y del tiempo de entrega**, porque no arrancás de cero |

---

## 5. Pricing

Referencia de mercado (Argentina, 2026) para e-commerce a medida vía freelance/agencia:

- Setup: **$600.000 – $1.000.000+ ARS** (desarrollo a medida desde cero)
- Tiendanube-style (plataforma armada, no a medida): setup $200.000–$500.000 ARS + plan mensual
- Mantenimiento mensual de mercado: **$20.000 – $80.000 ARS/mes**

Como tu costo marginal por cliente es bajo (no programás desde cero), podés **cobrar bastante menos que el desarrollo a medida** — eso es tu gancho de venta frente a comercios con presupuesto ajustado — y seguir siendo muy rentable por hora real trabajada.

**Precio sugerido:**

| Concepto | Precio sugerido | Qué incluye |
|---|---|---|
| Setup (pago único) | $250.000 – $400.000 ARS | Deploy del sitio en tu infraestructura, dominio del cliente registrado y configurado, carga inicial de catálogo (hasta ~30-40 productos), personalización de marca (colores/logo/tipografía) vía el panel de Diseño, capacitación de 1 hora al dueño/encargado |
| Mensualidad "todo incluido" | $50.000 – $70.000 ARS/mes | Hosting + dominio + soporte + cambios chicos (agregar producto puntual si no pueden solos, ajustes de diseño) — el cliente no administra nada técnico, una sola factura por mes |
| Producto adicional grande (+40 productos) | a cotizar aparte | Carga de catálogo es lo único que escala con cantidad de productos |

Vas ajustando el número exacto según lo que veas que el mercado local está dispuesto a pagar — arrancá en la punta baja del rango con los primeros 2-3 clientes (son also tus casos de éxito/testimonios) y subilo a medida que tengas prueba social.

**Forma de cobro:** 50% del setup por adelantado (para arrancar), 50% contra entrega. La mensualidad se cobra por adelantado, mes a mes, por transferencia o Mercado Pago.

---

## 6. Estructura de costos — vos administrás el hosting, el cliente no toca nada técnico

Cambio de criterio respecto a la primera versión de este plan: pedirle a un comercio que cree su propia cuenta de Render, configure un dominio y entienda qué es Cloudinary es pedirle demasiado — la enorme mayoría de tus clientes no va a poder o no va a querer hacerlo, y eso te va a frenar ventas. La solución: **vos mantenés una única cuenta propia de hosting con un servicio por cliente, registrás el dominio a nombre del cliente, y le facturás todo junto dentro de la mensualidad.** El cliente paga una sola factura por mes y no vuelve a pensar en el tema técnico.

Esto no rompe la lógica de "sin capital" — solo la ajusta: en vez de necesitar plata ahorrada, necesitás una tarjeta (débito o prepaga alcanza, los montos son chicos) para pagar suscripciones mensuales que después le facturás al cliente. Cobrando el 50% del setup por adelantado (punto 5) antes de deployar nada, nunca estás poniendo tu propia plata en juego: cobrás primero, gastás después.

**Costo real por cliente (lo pagás vos, se lo cobrás dentro de la mensualidad):**

| Ítem | Costo aproximado | Notas |
|---|---|---|
| Hosting (Render, 2 servicios: back + front) | ~USD 14/mes ≈ $21.000 ARS/mes al dólar oficial de hoy (~$1.510) | Verificar plan vigente en render.com/pricing — sube o baja con el tipo de cambio, revisalo cada pocos meses |
| Base de datos Postgres | Usar Neon o Supabase (tier gratuito, no vence) en vez del Postgres pago de Render | $0 si te mantenés en el tier gratuito de esos proveedores |
| Cloudinary (imágenes) | Gratis hasta 25 créditos/mes por cuenta — para varios clientes, conviene una cuenta de Cloudinary por cliente (todas gratuitas) en vez de compartir una sola | $0 mientras cada catálogo sea chico/mediano |
| Dominio .com.ar | $8.500 ARS/año ≈ $710 ARS/mes | Se registra a nombre del cliente (con tus datos de contacto como gestor), aunque lo pagues vos |
| **Total aproximado por cliente** | **~$22.000 ARS/mes** | Con la mensualidad sugerida de $50.000-$70.000, te queda un margen de $28.000-$48.000/mes por cliente antes de contar tu tiempo de soporte |

**Tu otro costo fijo es el monotributo**, que activás recién cuando tengas el primer cliente cerrado (no hace falta antes):

| Ítem | Costo |
|---|---|
| Monotributo Categoría A | ~$42.387 ARS/mes (verificar categoría/monto vigente en afip.gob.ar/monotributo) — existe Monotributo Social (~$11.000/mes) si calificás, vale la pena chequear el requisito |

Con un solo cliente ya cubrís sobradamente el hosting de ese cliente y buena parte del monotributo. Con el segundo cliente, estás en ganancia neta recurrente clara.

**Bonus de este enfoque:** al ser vos quien controla el hosting, tenés una palanca real si un cliente deja de pagar (podés pausar el sitio) — mucho más simple que perseguir una deuda. Ver punto 11.

---

## 7. Cómo conseguir los primeros clientes sin gastar un peso

Nada de este canal requiere presupuesto de ads — es 100% trabajo directo:

1. **Este mismo sitio es tu portfolio.** Mostralo tal cual está (con productos demo) como prueba de lo que podés armar. Sacale unas capturas de pantalla lindas del catálogo, el checkout y el panel de Diseño para usar en tu pitch.
2. **Recorré/contactá comercios reales** que ya identificaste antes (locales sin web o con web vieja): visita en persona o mensaje directo por Instagram/WhatsApp. El pitch es simple: *"Vi que vendés por Instagram pero no tenés dónde cobrar/mostrar el catálogo ordenado — te armo una tienda online con Mercado Pago en una semana, vos la manejás sin saber programar."*
3. **Grupos locales de emprendedores/comercio** (Facebook, WhatsApp) de tu zona — se puede publicar gratis.
4. **Primer cliente con descuento a cambio de testimonio/referencia.** El objetivo de los primeros 2-3 no es la ganancia máxima, es tener casos reales para mostrar y pedir que te recomienden a otro comercio del rubro.
5. **Después del tercer cliente, activá el boca en boca:** ofrecé un mes gratis de mensualidad a quien te refiera un cliente que cierre.

---

## 8. Proceso de alta de un cliente nuevo (para que sepas cuánto tiempo real te lleva)

| Paso | Tiempo estimado |
|---|---|
| Reunión inicial + acuerdo de precio + cobro del 50% de seña | 30-60 min |
| Registrar el dominio a nombre del cliente + crear el servicio nuevo en tu cuenta de hosting | 30-45 min |
| Deploy del sitio en tu infraestructura | 1-2 horas |
| Carga de catálogo inicial (usando el panel de admin) | 2-6 horas según cantidad de productos y si el cliente ya te pasa fotos/precios ordenados |
| Personalización de marca (colores, logo, secciones de la Home) vía panel de Diseño | 1-2 horas |
| Capacitación al dueño (cómo cargar productos, ver pedidos) | 1 hora |
| **Total** | **1-2 días de trabajo real**, no semanas |

Esto es lo que te permite tomar varios clientes en paralelo sin que cada uno te ocupe un mes entero.

---

## 9. Proyección de ingresos (escenario conservador, 12 meses)

Supuestos: cerrás en promedio 1 cliente nuevo cada 5-6 semanas trabajando en esto part-time junto con otras cosas; setup promedio $320.000 ARS; mensualidad promedio $55.000 ARS (punto medio del rango "todo incluido"); costo de hosting ~$22.000 ARS/mes por cliente activo (lo pagás vos, va incluido en lo que cobrás); monotributo arranca en el mes 2.

| Mes | Clientes acumulados | Ingreso por setup (ese mes) | MRR bruto | Hosting de esos clientes | Monotributo | Resultado neto aprox. del mes |
|---|---|---|---|---|---|---|
| 1 | 0 | $0 | $0 | $0 | $0 | $0 |
| 2 | 1 | $320.000 | $55.000 | -$22.000 | -$42.000 | ~$311.000 |
| 4 | 2 | $320.000 | $110.000 | -$44.000 | -$42.000 | ~$344.000 |
| 6 | 3 | $320.000 | $165.000 | -$66.000 | -$42.000 | ~$377.000 |
| 9 | 5 | $320.000 | $275.000 | -$110.000 | -$42.000 | ~$443.000 |
| 12 | 7 | $320.000 | $385.000 | -$154.000 | -$42.000 | ~$509.000 |

A los 12 meses, con 7 clientes (ritmo muy conservador para vender solo con tiempo, sin ads), ya tenés **$385.000 ARS/mes de facturación recurrente**, de los cuales **~$231.000 ARS/mes son margen neto real** después de pagarles el hosting a esos 7 clientes — cobrando eso todos los meses sin tener que trabajar nada nuevo ese mes. Eso es lo que hace rentable este modelo a mediano plazo frente a un freelance suelto: la base de mensualidades no para de crecer mientras sigas sumando clientes, y ahora ese ingreso te lo ganás vos completo (antes el hosting lo pagaba el cliente aparte, pero eso complicaba la venta).

*(Números orientativos — ajustalos vos con lo que veas en tus primeras conversaciones reales de venta; lo importante es la lógica: el MRR compone, el trabajo de un cliente nuevo no te saca tiempo de cobrarle a los anteriores.)*

---

## 10. Roadmap — primeros 90 días

**Días 1-15 — Preparar el terreno**
- Dejar este sitio impecable como demo/portfolio (ya hiciste una buena parte con la auditoría reciente).
- Armar la lista de 15-20 comercios reales candidatos (retomar/actualizar la que ya habías armado antes).
- Preparar el pitch de una página (qué ofrecés, precio, cómo es el proceso) para mandar por WhatsApp/Instagram.

**Días 15-30 — Primer contacto**
- Contactar/visitar los 15-20 candidatos.
- Meta: agendar 5 reuniones/conversaciones reales.
- Cerrar el primer cliente (aunque sea con descuento por ser el primero).

**Días 30-60 — Primer cliente en producción + segunda ronda**
- Entregar el primer sitio, pedir testimonio/foto para mostrar.
- Registrar el monotributo.
- Retomar contacto con los candidatos que no cerraron en la primera ronda, ahora con un caso real para mostrar.
- Meta: 2do y 3er cliente cerrados.

**Días 60-90 — Sistematizar**
- Documentar el proceso de alta como checklist repetible (para no reinventar cada vez).
- Empezar a pedir referidos activamente a los clientes activos.
- Evaluar: ¿qué tan angosto tenía que ser el ICP? ¿conviene subir precio? ajustar con datos reales, no con este documento.

---

## 11. Riesgos principales y cómo mitigarlos

| Riesgo | Mitigación |
|---|---|
| Vender lleva más tiempo del esperado (sos programador, no vendedor) | Empezá con contactos tibios (conocidos, conocidos de conocidos) antes de salir en frío; el primer cliente valida el pitch |
| El cliente no sabe usar el panel y te pide ayuda todo el tiempo | La capacitación inicial (1 hora) + un instructivo corto en PDF/video reduce esto; la mensualidad ya contempla algo de soporte |
| Cliente deja de pagar la mensualidad | Como el sitio corre en tu cuenta de hosting, podés pausarlo si no paga (dejalo por escrito en el acuerdo desde el día uno, para que no sea sorpresa) — mucho más simple que perseguir una deuda sin ninguna palanca |
| Vos administrás todo el hosting: si algún día un cliente se quiere ir, tiene que poder llevarse sus datos | Dejá por escrito (y cumplilo) que ante una baja le exportás su catálogo/pedidos y lo ayudás a migrar — protege tu reputación y tus referidos |
| Cada cliente corre en infraestructura separada, así que si tocás código para uno, no se propaga a los demás automáticamente | A medida que sumes clientes, versioná el código base (un repo "plantilla") y aplicá mejoras a todos de forma manual pero ordenada — no es un problema hasta que tengas 10+ clientes |
| Te cansás de hacer soporte 1 a 1 y no escala | Es la señal de que llegó el momento de evaluar el camino SaaS multi-tienda (opción que descartamos para *ahora*, no para siempre) |
| Necesitás una tarjeta para pagar Render/Cloudinary/el dominio de cada cliente | Con débito o prepaga alcanza — son cargos chicos y recurrentes, no una inversión grande. Cobrar el 50% de seña antes de deployar evita que alguna vez pongas plata propia en juego |

---

## 12. Qué hacer esta semana

1. Confirmar el pricing final que vas a usar (podés arrancar con los números de este plan y ajustar).
2. Sacar 4-5 capturas de pantalla lindas de este sitio para usar como portfolio.
3. Escribir el mensaje de contacto para comercios (una versión corta para WhatsApp/Instagram).
4. Retomar/armar la lista de candidatos reales y mandar los primeros 5 mensajes.

---

*Este plan asume el escenario que elegiste: agencia con ingreso recurrente, prácticamente sin capital de inversión (administrando vos el hosting a cambio de una tarjeta para pagos chicos y recurrentes, no de ahorros), apalancando la plataforma que ya tenés funcionando. Los números de mercado (pricing de la competencia, monotributo, hosting, tipo de cambio) están sujetos a variación — conviene reverificarlos cada pocos meses, sobre todo en un contexto de precios en pesos que se actualiza seguido.*
