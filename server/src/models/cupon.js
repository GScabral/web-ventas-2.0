const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const Cupon = sequelize.define("Cupon", {

    id_cupon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Se guarda siempre en mayúsculas (ver el controller) para que la
    // validación en el checkout no dependa de que el cliente lo
    // escriba con la misma capitalización exacta.
    codigo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    tipo: {
      type: DataTypes.ENUM("porcentaje", "fijo"),
      allowNull: false,
      defaultValue: "porcentaje",
    },

    // Si tipo = "porcentaje": número de 1 a 100.
    // Si tipo = "fijo": monto en pesos a descontar.
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // Rango de vigencia opcional. Si los dos quedan null, el cupón no
    // vence nunca (mientras esté "activo").
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Tope de usos totales (no por cliente). Null = sin límite.
    usos_maximos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    usos_actuales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Compra mínima para poder usar el cupón. Null = sin mínimo.
    monto_minimo: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

  });

  return Cupon;
};
