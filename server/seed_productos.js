// ============================================================
// SEED: 40 productos de ropa con imágenes reales para probar
// ------------------------------------------------------------
// Carga 40 productos (con categorías, talles, colores, stock e
// imágenes reales de ropa) para hacer una prueba realista del sitio.
//
// Cómo correrlo:
//   1. Pará el servidor si está corriendo (no es obligatorio).
//   2. Desde la carpeta /server, con el .env configurado:
//        node seed_productos.js
//   3. Listo: entrá a la tienda y vas a ver los 40 productos.
//
// Notas:
//   • Las imágenes son de un catálogo público de prueba
//     (cdn.dummyjson.com) — reales y funcionando, ideales para
//     testear. Para una tienda de verdad, cada comercio sube sus
//     propias fotos desde el panel (van a Cloudinary).
//   • El script NO borra nada: solo agrega. Si querés partir de
//     cero, corré antes vaciar_base_para_pruebas.sql.
//   • Saltea los productos cuyo nombre ya exista, así se puede
//     correr dos veces sin duplicar.
// ============================================================

require("dotenv").config();

// Chequeo temprano: sin la URL de la base, db.js explota con un error
// poco claro. Avisamos con un mensaje útil ANTES de requerir la conexión.
if (!process.env.DATABASE_URL) {
    console.error(
        "\n❌ Falta la variable DATABASE_URL.\n\n" +
        "Este script se conecta a tu base de datos, y necesita saber a cuál.\n" +
        "Tenés dos opciones:\n\n" +
        "  1) Crear un archivo  server/.env  con esta línea (poné TU connection string):\n" +
        "       DATABASE_URL=postgres://usuario:password@host:5432/nombre_db\n\n" +
        "     La sacás de tu proveedor de base:\n" +
        "       • Render:   tu base → 'External Database URL'\n" +
        "       • Neon/Supabase:  'Connection string'\n\n" +
        "  2) O pasarla en la misma línea (Git Bash), sin crear el archivo:\n" +
        "       DATABASE_URL=\"postgres://...\" node seed_productos.js\n"
    );
    process.exit(1);
}

const { conn, Categorias, Productos, variantesproductos } = require("./src/db");

// Helper: arma la lista de URLs de imágenes de un producto.
// u("mens-shirts", "man-plaid-shirt")        -> [1.webp, 2.webp, 3.webp]
// u("mens-shirts", "man-plaid-shirt", 2, 2)  -> [2.webp, 3.webp]
const u = (cat, slug, count = 3, start = 1) =>
    Array.from({ length: count }, (_, i) =>
        `https://cdn.dummyjson.com/product-images/${cat}/${slug}/${start + i}.webp`
    );

// Talles según el tipo de producto.
const TALLES_ROPA = ["S", "M", "L", "XL"];
const TALLES_CALZADO = ["37", "38", "39", "40", "41", "42"];
const TALLE_UNICO = ["Único"];

// Categorías de la tienda (nombre + slug).
const CATEGORIAS = [
    { nombre: "Camisas", slug: "camisas" },
    { nombre: "Vestidos", slug: "vestidos" },
    { nombre: "Calzado", slug: "calzado" },
    { nombre: "Carteras y bolsos", slug: "carteras-y-bolsos" },
    { nombre: "Anteojos", slug: "anteojos" },
];

// Los 40 productos. Cada uno: nombre, descripción, precio (ARS),
// categoría, rama (grupo), color, talles e imágenes reales.
const PRODUCTOS = [
    // ---------- CAMISAS ----------
    { nombre: "Camisa a Cuadros Azul y Negro", precio: 24900, categoria: "Camisas", rama: "Hombre", color: "Azul", talles: TALLES_ROPA, imagenes: u("mens-shirts", "blue-&-black-check-shirt"), descripcion: "Camisa de algodón con clásico estampado a cuadros. Cómoda y versátil para el día a día." },
    { nombre: "Remera Estampada Aorus", precio: 18900, categoria: "Camisas", rama: "Hombre", color: "Negro", talles: TALLES_ROPA, imagenes: u("mens-shirts", "gigabyte-aorus-men-tshirt"), descripcion: "Remera de corte moderno con diseño estampado. Ideal para un look casual." },
    { nombre: "Camisa Escocesa", precio: 27900, categoria: "Camisas", rama: "Hombre", color: "Rojo", talles: TALLES_ROPA, imagenes: u("mens-shirts", "man-plaid-shirt"), descripcion: "Camisa a cuadros escoceses, un básico atemporal para cualquier ocasión." },
    { nombre: "Camisa Manga Corta", precio: 21900, categoria: "Camisas", rama: "Hombre", color: "Celeste", talles: TALLES_ROPA, imagenes: u("mens-shirts", "man-short-sleeve-shirt"), descripcion: "Camisa fresca de manga corta, perfecta para los días de calor." },
    { nombre: "Camisa a Cuadros Clásica", precio: 25900, categoria: "Camisas", rama: "Hombre", color: "Gris", talles: TALLES_ROPA, imagenes: u("mens-shirts", "men-check-shirt"), descripcion: "Camisa a cuadros de calce prolijo, suma un toque smart casual." },
    { nombre: "Camisa Slim a Cuadros", precio: 26900, categoria: "Camisas", rama: "Hombre", color: "Azul", talles: TALLES_ROPA, imagenes: u("mens-shirts", "blue-&-black-check-shirt", 2, 2), descripcion: "Versión de calce entallado de nuestra camisa a cuadros más vendida." },

    // ---------- VESTIDOS ----------
    { nombre: "Vestido de Gala Negro", precio: 54900, categoria: "Vestidos", rama: "Mujer", color: "Negro", talles: TALLES_ROPA, imagenes: u("womens-dresses", "black-women's-gown"), descripcion: "Vestido largo de gala, elegante y sofisticado para eventos especiales." },
    { nombre: "Corset de Cuero con Pollera", precio: 47900, categoria: "Vestidos", rama: "Mujer", color: "Negro", talles: TALLES_ROPA, imagenes: u("womens-dresses", "corset-leather-with-skirt"), descripcion: "Conjunto de corset de cuero ecológico con pollera, para un look audaz." },
    { nombre: "Corset con Pollera Negra", precio: 44900, categoria: "Vestidos", rama: "Mujer", color: "Negro", talles: TALLES_ROPA, imagenes: u("womens-dresses", "corset-with-black-skirt"), descripcion: "Corset combinado con pollera negra, ideal para la noche." },
    { nombre: "Vestido Pea", precio: 39900, categoria: "Vestidos", rama: "Mujer", color: "Verde", talles: TALLES_ROPA, imagenes: u("womens-dresses", "dress-pea"), descripcion: "Vestido de diseño moderno y calce cómodo, un básico con estilo." },
    { nombre: "Conjunto Rojo y Negro", precio: 58900, categoria: "Vestidos", rama: "Mujer", color: "Rojo", talles: TALLES_ROPA, imagenes: u("womens-dresses", "marni-red-&-black-suit"), descripcion: "Conjunto de dos piezas en rojo y negro, elegante y con impronta única." },
    { nombre: "Vestido Azul", precio: 35900, categoria: "Vestidos", rama: "Mujer", color: "Azul", talles: TALLES_ROPA, imagenes: u("tops", "blue-frock"), descripcion: "Vestido azul de líneas simples, cómodo y fácil de combinar." },
    { nombre: "Vestido de Verano", precio: 32900, categoria: "Vestidos", rama: "Mujer", color: "Rosa", talles: TALLES_ROPA, imagenes: u("tops", "girl-summer-dress"), descripcion: "Vestido liviano y fresco, pensado para los días soleados." },
    { nombre: "Vestido Gris", precio: 34900, categoria: "Vestidos", rama: "Mujer", color: "Gris", talles: TALLES_ROPA, imagenes: u("tops", "gray-dress"), descripcion: "Vestido gris de corte clásico, elegante y versátil." },
    { nombre: "Vestido Corto", precio: 31900, categoria: "Vestidos", rama: "Mujer", color: "Beige", talles: TALLES_ROPA, imagenes: u("tops", "short-frock"), descripcion: "Vestido corto juvenil, ideal para una salida informal." },
    { nombre: "Vestido Tartán", precio: 37900, categoria: "Vestidos", rama: "Mujer", color: "Rojo", talles: TALLES_ROPA, imagenes: u("tops", "tartan-dress"), descripcion: "Vestido con estampado tartán, un clásico que nunca pasa de moda." },
    { nombre: "Vestido de Gala Largo", precio: 56900, categoria: "Vestidos", rama: "Mujer", color: "Negro", talles: TALLES_ROPA, imagenes: u("womens-dresses", "black-women's-gown", 2, 2), descripcion: "Otra vista de nuestro vestido de gala, con caída y brillo espectaculares." },

    // ---------- CALZADO ----------
    { nombre: "Zapatillas Air Jordan 1 Rojo y Negro", precio: 89900, categoria: "Calzado", rama: "Hombre", color: "Rojo", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "nike-air-jordan-1-red-and-black"), descripcion: "Zapatillas ícono en combinación rojo y negro. Estilo y comodidad." },
    { nombre: "Botines Deportivos", precio: 64900, categoria: "Calzado", rama: "Hombre", color: "Negro", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "nike-baseball-cleats"), descripcion: "Botines con buen agarre, pensados para el deporte y el uso intensivo." },
    { nombre: "Zapatillas Puma Future Rider", precio: 74900, categoria: "Calzado", rama: "Hombre", color: "Beige", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "puma-future-rider-trainers"), descripcion: "Zapatillas retro-running livianas y con mucho estilo urbano." },
    { nombre: "Zapatillas Deportivas Off White y Rojo", precio: 69900, categoria: "Calzado", rama: "Hombre", color: "Blanco", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "sports-sneakers-off-white-&-red"), descripcion: "Zapatillas deportivas en blanco roto y rojo, para entrenar con onda." },
    { nombre: "Zapatillas Deportivas Blanco y Rojo", precio: 67900, categoria: "Calzado", rama: "Hombre", color: "Blanco", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "sports-sneakers-off-white-red"), descripcion: "Modelo deportivo clásico en blanco y rojo, cómodo para todo el día." },
    { nombre: "Pantufla Negra y Marrón", precio: 28900, categoria: "Calzado", rama: "Mujer", color: "Marrón", talles: TALLES_CALZADO, imagenes: u("womens-shoes", "black-&-brown-slipper"), descripcion: "Pantufla abrigada y cómoda para estar en casa." },
    { nombre: "Zapatos de Taco Calvin Klein", precio: 82900, categoria: "Calzado", rama: "Mujer", color: "Negro", talles: TALLES_CALZADO, imagenes: u("womens-shoes", "calvin-klein-heel-shoes"), descripcion: "Zapatos de taco elegantes, ideales para ocasiones especiales." },
    { nombre: "Zapatos Dorados", precio: 59900, categoria: "Calzado", rama: "Mujer", color: "Dorado", talles: TALLES_CALZADO, imagenes: u("womens-shoes", "golden-shoes-woman"), descripcion: "Zapatos dorados que aportan brillo y distinción a tu look." },
    { nombre: "Zapatos Pampi", precio: 46900, categoria: "Calzado", rama: "Mujer", color: "Beige", talles: TALLES_CALZADO, imagenes: u("womens-shoes", "pampi-shoes"), descripcion: "Zapatos cómodos de uso diario, con un diseño simple y elegante." },
    { nombre: "Zapatos Rojos", precio: 52900, categoria: "Calzado", rama: "Mujer", color: "Rojo", talles: TALLES_CALZADO, imagenes: u("womens-shoes", "red-shoes"), descripcion: "Zapatos rojos que se llevan todas las miradas." },
    { nombre: "Zapatillas Puma Edición Especial", precio: 76900, categoria: "Calzado", rama: "Hombre", color: "Beige", talles: TALLES_CALZADO, imagenes: u("mens-shoes", "puma-future-rider-trainers", 2, 2), descripcion: "Otra vista de las Puma Future Rider, en su edición especial." },

    // ---------- CARTERAS Y BOLSOS ----------
    { nombre: "Cartera Azul", precio: 42900, categoria: "Carteras y bolsos", rama: "Mujer", color: "Azul", talles: TALLE_UNICO, imagenes: u("womens-bags", "blue-women's-handbag"), descripcion: "Cartera de mano en azul, espaciosa y con terminaciones prolijas." },
    { nombre: "Cartera de Cuero Heshe", precio: 64900, categoria: "Carteras y bolsos", rama: "Mujer", color: "Marrón", talles: TALLE_UNICO, imagenes: u("womens-bags", "heshe-women's-leather-bag"), descripcion: "Cartera de cuero genuino, resistente y elegante para el día a día." },
    { nombre: "Cartera Estilo Prada", precio: 71900, categoria: "Carteras y bolsos", rama: "Mujer", color: "Negro", talles: TALLE_UNICO, imagenes: u("womens-bags", "prada-women-bag"), descripcion: "Cartera de diseño sofisticado, un accesorio que marca la diferencia." },
    { nombre: "Mochila Símil Cuero Blanca", precio: 48900, categoria: "Carteras y bolsos", rama: "Unisex", color: "Blanco", talles: TALLE_UNICO, imagenes: u("womens-bags", "white-faux-leather-backpack"), descripcion: "Mochila de símil cuero blanca, práctica y con mucho estilo." },
    { nombre: "Cartera Negra", precio: 39900, categoria: "Carteras y bolsos", rama: "Mujer", color: "Negro", talles: TALLE_UNICO, imagenes: u("womens-bags", "women-handbag-black"), descripcion: "Cartera negra clásica, combina con todo y es súper funcional." },
    { nombre: "Cartera de Cuero Premium", precio: 68900, categoria: "Carteras y bolsos", rama: "Mujer", color: "Marrón", talles: TALLE_UNICO, imagenes: u("womens-bags", "heshe-women's-leather-bag", 2, 2), descripcion: "Otra vista de nuestra cartera de cuero, en su línea premium." },

    // ---------- ANTEOJOS ----------
    { nombre: "Anteojos de Sol Negros", precio: 15900, categoria: "Anteojos", rama: "Unisex", color: "Negro", talles: TALLE_UNICO, imagenes: u("sunglasses", "black-sun-glasses"), descripcion: "Anteojos de sol negros con protección UV. Un clásico que nunca falla." },
    { nombre: "Anteojos de Sol Clásicos", precio: 16900, categoria: "Anteojos", rama: "Unisex", color: "Marrón", talles: TALLE_UNICO, imagenes: u("sunglasses", "classic-sun-glasses"), descripcion: "Modelo clásico de anteojos de sol, atemporal y elegante." },
    { nombre: "Anteojos Verde y Negro", precio: 18900, categoria: "Anteojos", rama: "Unisex", color: "Verde", talles: TALLE_UNICO, imagenes: u("sunglasses", "green-and-black-glasses"), descripcion: "Anteojos de sol en verde y negro, para un look distinto." },
    { nombre: "Anteojos de Fiesta", precio: 12900, categoria: "Anteojos", rama: "Unisex", color: "Multicolor", talles: TALLE_UNICO, imagenes: u("sunglasses", "party-glasses"), descripcion: "Anteojos divertidos para fiestas y eventos. ¡Que no falte la onda!" },
    { nombre: "Anteojos de Sol", precio: 14900, categoria: "Anteojos", rama: "Unisex", color: "Negro", talles: TALLE_UNICO, imagenes: u("sunglasses", "sunglasses"), descripcion: "Anteojos de sol versátiles, livianos y con buena protección." },
    { nombre: "Anteojos de Sol Premium", precio: 21900, categoria: "Anteojos", rama: "Unisex", color: "Negro", talles: TALLE_UNICO, imagenes: u("sunglasses", "sunglasses", 2, 2), descripcion: "Línea premium de nuestros anteojos de sol más vendidos." },
];

// Stock por talle (fijo, suficiente para probar el flujo de compra).
const STOCK_POR_TALLE = 12;

async function seed() {
    try {
        await conn.authenticate();
        // Crea las tablas que falten (no borra ni altera nada existente),
        // por si se corre contra una base recién creada y todavía sin
        // estructura. Igual que hace el arranque del servidor.
        await conn.sync({ force: false });
        console.log("Conectado a la base. Cargando productos...\n");

        // 1) Categorías (no duplica si ya existen).
        const catPorNombre = {};
        for (const c of CATEGORIAS) {
            const [cat] = await Categorias.findOrCreate({
                where: { nombre: c.nombre },
                defaults: { slug: c.slug },
            });
            catPorNombre[c.nombre] = cat.id_categoria;
        }

        // 2) Productos + variantes.
        let creados = 0;
        let salteados = 0;

        for (const p of PRODUCTOS) {
            const yaExiste = await Productos.findOne({
                where: { nombre_producto: p.nombre },
            });

            if (yaExiste) {
                salteados++;
                continue;
            }

            const producto = await Productos.create({
                nombre_producto: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                rama: p.rama,
                categoriaId: catPorNombre[p.categoria],
            });

            // Una variante por cada talle (todas comparten color e imágenes,
            // igual que hace la carga real desde el panel).
            for (const talla of p.talles) {
                await variantesproductos.create({
                    talla,
                    color: p.color,
                    cantidad_disponible: STOCK_POR_TALLE,
                    ProductoIdProducto: producto.id_producto,
                    imagenes: p.imagenes,
                });
            }

            creados++;
            console.log(`✓ ${p.nombre}  (${p.categoria})`);
        }

        console.log(`\nListo. Productos creados: ${creados}. Salteados (ya existían): ${salteados}.`);
        console.log("Entrá a la tienda y refrescá para verlos.\n");

    } catch (error) {
        console.error("\n❌ Error cargando los productos:", error.message);
        console.error(error);
    } finally {
        await conn.close();
    }
}

seed();
