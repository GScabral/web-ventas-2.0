require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const oferta = require('./models/oferta');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    native: false,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // necesario en Render
        },
    },
});



const basename = path.basename(__filename);
const modelDefiners = [];

// Leer los modelos y cargarlos en el arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
        const model = require(path.join(__dirname, '/models', file));
        modelDefiners.push(model);
    });

// Inicializar los modelos
modelDefiners.forEach(model => model(sequelize, DataTypes));

// Obtener los modelos
const models = sequelize.models;

// Definir las relaciones
if (models) {
    const { Productos, Pedido, Cliente, DetallesPedido, variantesproductos, oferta } = models;

    Pedido.belongsToMany(Productos, { through: 'pedidoproductos' });
    Productos.belongsToMany(Pedido, { through: 'pedidoproductos' });

    oferta.belongsTo(Productos, {
        foreignKey: 'producto_id', // Nombre de la columna en la tabla 'Oferta' que hace referencia al 'producto_id' en la tabla 'Producto'
        onDelete: 'CASCADE', // Acción a tomar cuando se elimine el producto asociado
        onUpdate: 'CASCADE', // Acción a tomar cuando se actualice el producto asociado
    });

    Cliente.hasMany(Pedido); // Un cliente puede tener muchos pedidos
    Pedido.belongsTo(Cliente); // Un pedido pertenece a un cliente

    // En el modelo Pedido
    Pedido.hasMany(DetallesPedido, { foreignKey: 'PedidoIdPedido' });

    DetallesPedido.belongsTo(Pedido, { foreignKey: 'PedidoIdPedido' });

    Productos.hasMany(variantesproductos, { foreignKey: 'ProductoIdProducto' });

    variantesproductos.belongsTo(Productos, { foreignKey: 'ProductoIdProducto' });

}

module.exports = {
    ...sequelize.models,
    conn: sequelize,
};