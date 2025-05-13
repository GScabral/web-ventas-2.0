const { variantesproductos,Productos } = require('../../db');


const actualizarStock = async (idProducto, datosProducto) => {

    console.log("id",idProducto),
    
    console.log("datos",datosProducto)
    try {
        // Busca el producto principal por su ID
        const producto = await Productos.findByPk(idProducto);
    
        if (!producto) {
          console.log("Producto no encontrado");
          return;
        }
    
        // Actualiza los campos del producto principal
        producto.nombre = datosProducto.nombre;
        producto.precio = datosProducto.precio;
        producto.categoria = datosProducto.categoria;
        // Agrega otros campos que desees actualizar
    
        // Guarda el producto actualizado
        await producto.save();
    
        // Recorre las variantes del producto y actualiza la cantidad disponible
        for (const variante of datosProducto.variantes) {
            const { idVariante, cantidad_disponible, color, talla } = variante;
            
            // Busca la variante por su ID
            const varianteProducto = await variantesproductos.findByPk(idVariante);
            
            if (varianteProducto) {
                // Actualiza la cantidad disponible, color y tamaño de la variante
                varianteProducto.cantidad_disponible = cantidad_disponible;
                varianteProducto.color = color;
                varianteProducto.talla = talla;
                
                // Guarda la variante actualizada
                await varianteProducto.save();
            } else {
                console.log(`Variante con ID ${idVariante} no encontrada`);
            }
        }
    
        console.log("Producto actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
};
  
  module.exports =actualizarStock;