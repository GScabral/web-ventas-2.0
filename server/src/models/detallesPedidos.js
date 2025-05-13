const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const DetallesPedido = sequelize.define('DetallesPedido', {
      id_detalle_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cantidad: {
        type: DataTypes.INTEGER,
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
      },
      color: {
        type: DataTypes.STRING, // Agregar campo para el color
      },
      talle: {
        type: DataTypes.STRING, // Agregar campo para el talle
      },
      estado_pedido: {
        type: DataTypes.STRING(20),
      },
      nombre: {
        type: DataTypes.STRING, // Agregar campo para el nombre
      },    
      total: {
        type: DataTypes.FLOAT, // O el tipo de dato adecuado para tu caso
        allowNull: false,
        defaultValue: 0, // Puedes establecer un valor predeterminado si lo deseas
      },
     
      // Otros campos adicionales que necesites...
    }, {
      tableName: 'detalles_pedido', // Nombre de la tabla en la base de datos
      timestamps: false, // Si no utilizas campos de timestamps (created_at, updated_at)
    });
  
    return DetallesPedido;
  };



//   ALTER TABLE detalles_pedido
// ADD  total NUMERIC(10, 2) DEFAULT 0;