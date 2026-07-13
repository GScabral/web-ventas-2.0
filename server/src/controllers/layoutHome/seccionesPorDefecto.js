// Estado inicial de la Home la primera vez que existe esta feature en
// una instalación: reproduce EXACTAMENTE lo que Home.jsx mostraba antes
// del editor de Diseño (banner, catálogo, newsletter) — así, al
// deployar esto, ningún sitio existente cambia de aspecto hasta que el
// admin entre al panel y prenda alguna sección nueva a propósito.
const seccionesPorDefecto = () => ([
    { tipo: "banner", visible: true, orden: 0, contenido: {} },
    // Oculto por defecto: el hero es una sección más nueva que el resto
    // (ver componentes/secciones/HeroSection.jsx) y todavía nadie cargó
    // título/imagen para él en una instalación recién deployada.
    {
        tipo: "hero",
        visible: false,
        orden: 1,
        contenido: {
            titulo: "",
            subtitulo: "",
            imagen: "",
            textoBoton: "Ver catálogo",
            linkBoton: "/",
        },
    },
    {
        tipo: "destacados",
        visible: false,
        orden: 2,
        contenido: {
            seccionSlug: "destacados",
            titulo: "Las prendas que marcan tendencia",
            cantidad: 5,
        },
    },
    {
        tipo: "categorias",
        visible: false,
        orden: 3,
        contenido: { titulo: "Comprá por categoría" },
    },
    { tipo: "catalogo", visible: true, orden: 4, contenido: {} },
    {
        tipo: "testimonios",
        visible: false,
        orden: 5,
        contenido: { titulo: "Lo que dicen nuestros clientes", estilo: "grilla" },
    },
    { tipo: "newsletter", visible: true, orden: 6, contenido: {} },
]);

module.exports = seccionesPorDefecto;
