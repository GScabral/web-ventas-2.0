const {Cliente} = require("../../db");

const verificarCorreo = async(req,res)=>{
    const {correo}=req.query;


    try{
        const clienteExistente = await Cliente.findOne({where:{correo}})

        return clienteExistente;
    }catch(error){
        console.error("error al verificar el correo electronico:",error);
        throw new Error("errpr interno del servidor")
    }
};

module.exports={verificarCorreo};
