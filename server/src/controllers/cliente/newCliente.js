const {Cliente} = require('../../db');

const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de hashing

const createNewCliente = async (clienteData) => {
  try {
    const { nombre, apellido, direccion, info_contacto, correo, contraseña } = clienteData;

    if (!nombre || !apellido || !direccion || !info_contacto || !correo || !contraseña) {
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
      info_contacto,
      correo,
      contraseña: hashedPassword, // Almacena la contraseña como un hash en la base de datos
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("Nuevo cliente creado id ", newCliente.id_cliente);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error en la creación del cliente", error);
    }
    return { error: "No pudimos crear la cuenta. Intentá de nuevo en unos minutos." };
  }
};

module.exports = createNewCliente;