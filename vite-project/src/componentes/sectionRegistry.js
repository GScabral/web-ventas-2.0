import PromoStrip from "./PromoStrip";
import Newsletter from "./Newsletter";
import DestacadosSection from "./secciones/DestacadosSection";
import CategoriasSection from "./secciones/CategoriasSection";
import TestimoniosSection from "./secciones/TestimoniosSection";
import CatalogoSection from "./secciones/CatalogoSection";
import HeroSection from "./secciones/HeroSection";

// Registro central: cada "tipo" de sección que puede aparecer en el
// layout de la Home (guardado en LayoutHome, editable desde el panel
// de Diseño) mapea a un componente real. Home.jsx no conoce ningún
// componente de sección por nombre — solo recorre el layout y busca acá
// qué renderizar. Agregar una sección nueva en el futuro es: crear el
// componente y sumar una entrada acá, nada más.
const sectionRegistry = {
    banner: PromoStrip,
    hero: HeroSection,
    destacados: DestacadosSection,
    categorias: CategoriasSection,
    catalogo: CatalogoSection,
    testimonios: TestimoniosSection,
    newsletter: Newsletter,
};

export default sectionRegistry;
