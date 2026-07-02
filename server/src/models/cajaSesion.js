const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const CajaSesion = sequelize.define("CajaSesion", {

    id_sesion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fecha_apertura: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Con cuánto efectivo se abre la caja.
    monto_inicial: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Lo que el sistema calcula que debería haber al cerrar:
    // inicial + ingresos - egresos. Se completa recién al cerrar.
    monto_final_esperado: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // Lo que el admin contó físicamente en el cajón al cerrar.
    monto_final_contado: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // contado - esperado. Positivo = sobrante, negativo = faltante.
    diferencia: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    estado: {
      type: DataTypes.ENUM("abierta", "cerrada"),
      defaultValue: "abierta",
    },

    notas_apertura: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    notas_cierre: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

  });

  return CajaSesion;
};
