const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config();


const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN })


const createPreference= async (pedidoData) => {
    console.log('Datos del pedido recibidos:', pedidoData);

    const infoProducto=pedidoData.map((items)=>{
        return{
            title:items.nombre,
            quantity:parseInt(items.cantidad),
            currency_id:'ARS',
            unit_price:parseFloat(items.total)
        }
    })

    try{
        const body= {
            items:infoProducto,

            back_urls:{
                success: "https://www.youtube.com/",
                failure: "https://www.youtube.com/",
                pending: "https://www.youtube.com/",
            },
            auto_return:'approved',
        }
        const preference= new Preference(client);
        const result=await preference.create({body});
        result.status(200).json(result.id)
    }catch(error){
        console.error("Error al procesar la solicitud:",error);
        resizeBy.status(400)-json({error:error.message})
    }

}


module.exports=createPreference