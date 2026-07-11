// Estado inicial de la Home la primera vez que existe esta feature en
// una instalación: reproduce EXACTAMENTE lo que Home.jsx mostraba antes
// del editor de Diseño (banner, catálogo, newsletter) — así, al
// deployar esto, ningún sitio existente cambia de aspecto hasta que el
// admin entre al panel y prenda alguna sección nueva a propósito.
const seccionesPorDefecto = () => ([
    { tipo: "banner", visible: true, orden: 0, contenido: {} },
    {
        tipo: "destacados",
        visible: false,
        orden: 1,
        contenido: {
            seccionSlug: "destacados",
            titulo: "Las prendas que marcan tendencia",
        },
    },
    {
        tipo: "categorias",
        visible: false,
        orden: 2,
        contenido: { titulo: "Comprá por categoría" },
    },
    { tipo: "catalogo", visible: true, orden: 3, contenido: {} },
    {
        tipo: "testimonios",
        visible: false,
        orden: 4,
        contenido: { titulo: "Lo que dicen nuestros clientes" },
    },
    { tipo: "newsletter", visible: true, orden: 5, contenido: {} },
]);

module.exports = seccionesPorDefecto;
