const { Cliente } = require('../../db');

const allClientes = async () => {
    try {
        // Nunca devolvemos el hash de la contraseña, ni siquiera al admin:
        // no hay ninguna pantalla que lo necesite y reduce el daño si esta
        // respuesta se filtra por algún otro medio.
        const listClintes = await Cliente.findAll({
            attributes: { exclude: ['contraseña'] }
        })
        return listClintes
    } catch (error) {
        console.error("Error al obtener todos los clientes:", error);
        throw error;
    }
}

module.exports = allClientes;