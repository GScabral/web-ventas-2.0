const { Cliente } = require('../../db');

const allClientes=async ()=>{
    try{
        const listClintes=await Cliente.findAll()
        return listClintes
    }catch(error){
        console.error("Error al obtener todos los clientes:", error);
        throw error; 
    }
}

module.exports= allClientes;