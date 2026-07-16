const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Cliente } = require("../../db");

// Mismas reglas que el registro (ver validacion.js): 8+ caracteres, al
// menos una letra y un número.
const validarContrasena = (contrasena) => {
    if (!contrasena || contrasena.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/[a-zA-Z]/.test(contrasena)) {
        return "La contraseña debe tener al menos una letra.";
    }
    if (!/[0-9]/.test(contrasena)) {
        return "La contraseña debe tener al menos un número.";
    }
    return null;
};

// Paso 2 del "olvidé mi contraseña": llega el token del mail + la nueva
// contraseña. Se busca al cliente por el HASH del token (así el token
// crudo del link nunca se guarda en la base), se verifica que no haya
// vencido, se guarda la contraseña nueva hasheada y se limpian los
// campos de reset para que el link no se pueda reusar.
const resetearContrasena = async (req, res) => {
    try {
        const { token, contrasena } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Falta el token." });
        }

        const errorContrasena = validarContrasena(contrasena);
        if (errorContrasena) {
            return res.status(400).json({ error: errorContrasena });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const cliente = await Cliente.findOne({
            where: {
                reset_token: tokenHash,
                reset_token_expira: { [Op.gt]: new Date() },
            },
        });

        if (!cliente) {
            return res.status(400).json({
                error: "El link no es válido o ya venció. Pedí uno nuevo.",
            });
        }

        cliente.contraseña = await bcrypt.hash(contrasena, 10);
        cliente.reset_token = null;
        cliente.reset_token_expira = null;
        await cliente.save();

        return res.status(200).json({
            mensaje: "Tu contraseña se cambió. Ya podés iniciar sesión.",
        });

    } catch (error) {
        console.error("Error en resetearContrasena:", error);
        return res.status(500).json({ error: "No pudimos cambiar la contraseña." });
    }
};

module.exports = resetearContrasena;
