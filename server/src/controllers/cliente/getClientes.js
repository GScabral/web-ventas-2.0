const { Cliente } = require('../../db');


const getClientePorId = async (idCliente) => {
    try {
        const infoCliente = await Cliente.findByPk(idCliente);

        if (!infoCliente) {
            throw new Error('Cliente no encontrado');
        }

        const cliente = {
            id: infoCliente.id_cliente,
            nombre: infoCliente.nombre,
            apellido: infoCliente.apellido,
            direccion: infoCliente.direccion,
            contacto: infoCliente.info_contacto
        };

        return cliente;
    }catch(error){
        console.error("erro al buscar info de el cliente")
        throw error
    }
}

module.exports=getClientePorId;