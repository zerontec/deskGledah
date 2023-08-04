const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('paymentCuenta', {

      montoPagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      fechaPago: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      metodoPago:{
        type: DataTypes.ARRAY(DataTypes.JSONB),

      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
 
    });

};