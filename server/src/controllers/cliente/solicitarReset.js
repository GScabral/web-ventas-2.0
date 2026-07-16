const crypto = require("crypto");
const { Cliente, ConfiguracionSitio } = require("../../db");
const { enviarMail, layoutMail } = require("../../utils/mailer");

// Cuánto vale un link de reset antes de vencer.
const VALIDEZ_MS = 60 * 60 * 1000; // 1 hora

const obtenerNombreTienda = async () => {
    try {
        const config = await ConfiguracionSitio.findOne({ where: { id: 1 } });
        return config?.nombre_tienda || "Tienda Online";
    } catch {
        return "Tienda Online";
    }
};

// Paso 1 del "olvidé mi contraseña": el cliente manda su correo. Si
// existe una cuenta con ese correo, se genera un token, se guarda su
// hash en la base (nunca el token en crudo) y se manda por mail un link
// para elegir una contraseña nueva.
//
// Importante: la respuesta al front SIEMPRE es la misma exista o no la
// cuenta. Si dijéramos "ese correo no está registrado", cualquiera
// podría usar este endpoint para averiguar qué correos tienen cuenta.
const solicitarReset = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ error: "Falta el correo." });
        }

        const respuestaGenerica = {
            mensaje:
                "Si hay una cuenta con ese correo, te enviamos un link para " +
                "restablecer tu contraseña. Revisá tu casilla (y el spam).",
        };

        const cliente = await Cliente.findOne({ where: { correo } });

        // Cuenta inexistente: cortamos acá pero devolvemos lo mismo.
        if (!cliente) {
            return res.status(200).json(respuestaGenerica);
        }

        // Token en crudo para el link; en la base guardamos solo su hash,
        // así ni con acceso a la base se puede reconstruir un link válido.
        const tokenCrudo = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(tokenCrudo).digest("hex");

        cliente.reset_token = tokenHash;
        cliente.reset_token_expira = new Date(Date.now() + VALIDEZ_MS);
        await cliente.save();

        // El front define la URL base con su propio dominio; el backend
        // arma el link con la primera URL de CLIENT_URL (puede haber
        // varias separadas por coma).
        const baseFront = (process.env.CLIENT_URL || "")
            .split(",")[0]
            .trim()
            .replace(/\/$/, "");

        const link = `${baseFront}/restablecer-contrasena?token=${tokenCrudo}`;

        const nombreTienda = await obtenerNombreTienda();

        const contenido = `
            <p>Hola${cliente.nombre ? ` ${cliente.nombre}` : ""},</p>
            <p>Recibimos un pedido para restablecer la contraseña de tu cuenta.
            Si fuiste vos, hacé clic en el botón de abajo. El link vence en 1 hora.</p>
            <p style="text-align:center;margin:28px 0;">
                <a href="${link}"
                   style="display:inline-block;background:#ff6b35;color:#fff;text-decoration:none;
                          padding:12px 26px;border-radius:8px;font-weight:bold;">
                    Cambiar mi contraseña
                </a>
            </p>
            <p style="font-size:13px;color:#8a8f98;">
                Si no pediste esto, podés ignorar este correo: tu contraseña
                no cambia hasta que uses el link.
            </p>
            <p style="font-size:12px;color:#b0b4bb;word-break:break-all;">${link}</p>
        `;

        try {
            await enviarMail({
                to: correo,
                subject: `Restablecer tu contraseña - ${nombreTienda}`,
                html: layoutMail(nombreTienda, contenido),
            });
        } catch (errorMail) {
            console.error("No se pudo enviar el mail de reset:", errorMail);
            // No revelamos el fallo al front (mismo criterio de privacidad);
            // el cliente puede reintentar.
        }

        return res.status(200).json(respuestaGenerica);

    } catch (error) {
        console.error("Error en solicitarReset:", error);
        return res.status(500).json({ error: "No pudimos procesar la solicitud." });
    }
};

module.exports = solicitarReset;
