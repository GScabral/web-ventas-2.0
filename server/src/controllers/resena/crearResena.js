const { Resena, Productos } = require("../../db");

// Crea una reseña pública sobre un producto. No requiere cuenta (así
// cualquier comprador puede dejarla). Valida que el producto exista y
// que la calificación sea 1-5. El texto se guarda tal cual; el front
// lo muestra escapado.
const crearResena = async (req, res) => {
    try {
        const { producto_id, nombre, calificacion, comentario } = req.body;

        if (!producto_id || !nombre || !comentario) {
            return res.status(400).json({
                error: "Completá tu nombre, la calificación y el comentario.",
            });
        }

        const nota = Number(calificacion);
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            return res.status(400).json({ error: "La calificación debe ser de 1 a 5 estrellas." });
        }

        if (String(comentario).trim().length < 3) {
            return res.status(400).json({ error: "El comentario es muy corto." });
        }

        const producto = await Productos.findByPk(producto_id);
        if (!producto) {
            return res.status(404).json({ error: "El producto no existe." });
        }

        const resena = await Resena.create({
            producto_id,
            nombre: String(nombre).trim().slice(0, 80),
            calificacion: nota,
            comentario: String(comentario).trim().slice(0, 1000),
            aprobado: true,
        });

        return res.status(201).json(resena);

    } catch (error) {
        console.error("Error en crearResena:", error);
        return res.status(500).json({ error: "No pudimos guardar tu reseña." });
    }
};

module.exports = crearResena;
