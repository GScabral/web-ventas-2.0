const {DataTypes} = require('sequelize');

module.exports=(sequelize)=>{
    const oferta = sequelize.define('oferta',{
        id_oferta:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        producto_id:{
            type: DataTypes.INTEGER
        },
        descuento:{
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        inicio:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        fin:{
            type: DataTypes.DATE,
            allowNull:false,
        }
    },{
        timestamps: false,
        tableName: 'oferta',
    })

    return oferta;
}