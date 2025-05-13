const { oferta } = require('../../db'); // Asegúrate de importar desde la ubicación correcta


const deleteOferta=async(id_oferta)=>{
    try {
        const ofertaDelete=await oferta.findByPk(id_oferta)

        if(!ofertaDelete){
            throw new Error("id No encontrado")
        }
        await oferta.destroy({
            where:{
                id_oferta:id_oferta
            }}
        );

        return("oferta eliminada")
    }catch(error){
        console.error("error al intetar eliminar el producto",error)
    }
}

module.exports = deleteOferta;