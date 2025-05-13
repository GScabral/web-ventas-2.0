const { Productos } = require('../../db');

const deleteProduct=async(id)=>{
    try{
        const productDelete=await Productos.findByPk(id)

        if(!productDelete){
            throw new Error("id no encontrado")
        }
        await productDelete.destroy();

        return("juego eliminado")
        
    }catch(error){
        console.error("error al intentar eliminar el producto",error)
    }
}

module.exports = deleteProduct;
