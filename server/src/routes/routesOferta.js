const {Router}=require("express")
const crearOferta = require("../controllers/oferta/newOferta");
const traerOferta=require("../controllers/oferta/getOferta")
const deleteOferta=require("../controllers/oferta/deleteOferta")



const router= Router();

router.get("/ofertas",async(req,res)=>{
    try{
        const oferta = await traerOferta();
        res.status(200).json(oferta);
    }catch(error){
        res.status(500).json({error:"eror al obtener producto"})
    }
})

router.post("/nuevaOferta",async(req,res)=>{

    try{
        const nuevaOferta=await crearOferta(req.body);
        if(nuevaOferta && nuevaOferta.erro ){
            res.status(404).json({error:nuevaOferta.message})
        }else{
            res.status(200).json(nuevaOferta)
        }
    }catch(error){
        res.status(500).json({error:"erro en el servidor"})
    }
})





router.delete("/eliminar/:id", async (req, res) => {
    console.log("id en route",req.params)

    const {id} = req.params;
    console.log("id en route",id)
    try {
        const eliminar = await deleteOferta(id);
        if (eliminar.error) {
            res.status(404).json({ error: eliminar.message });
        } else {
            res.status(200).json(eliminar);
        }
    } catch (error) {
        console.error("error al intertar eliminar el producto", error);
        res.status(500).json({ error: "error en el servidor" })
    }
})

module.exports = router