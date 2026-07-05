const {Cliente} = require('../../db');

const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de hashing

const createNewCliente = async (clienteData) => {
  try {
    // info_contacto se pedía acá antes, pero el modelo Cliente (ver
    // models/clientes.js) nunca tuvo esa columna — se exigía en el
    // front sin guardarse en ningún lado. Se saca del requisito.
    const { nombre, apellido, direccion, correo, contraseña } = clienteData;

    if (!nombre || !apellido || !direccion || !correo || !contraseña) {
      throw new Error("Faltan campos obligatorios para crear el usuario");
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("Datos correctamente recibidos ");
    }

    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const newCliente = await Cliente.create({
      nombre,
      apellido,
      direccion,
      correo,
      contraseña: hashedPassword, // Almacena la contraseña como un hash en la base de datos
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("Nuevo cliente creado id ", newCliente.id_cliente);
    }

    // Antes esta función no devolvía nada en el camino exitoso (undefined),
    // así que la ruta que la llama respondía 200 con el body vacío. Nunca
    // se devuelve la contraseña, ni siquiera el hash.
    return {
      id_cliente: newCliente.id_cliente,
      nombre: newCliente.nombre,
      apellido: newCliente.apellido,
      correo: newCliente.correo,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error en la creación del cliente", error);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return { error: "Ya existe una cuenta registrada con ese correo." };
    }

    return { error: "No pudimos crear la cuenta. Intentá de nuevo en unos minutos." };
  }
};

module.exports = createNewCliente;