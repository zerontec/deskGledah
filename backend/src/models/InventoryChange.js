const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('InventoryChange', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER, // Aquí debería ser el tipo correcto de tu clave foránea
      allowNull: false,
    },
    quantityChange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
      
      },
      name:{
        type:DataTypes.STRING
      },

    barcode: {
        type: DataTypes.STRING,
      
      },
      costo: {
        type: DataTypes.FLOAT,
        
      },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
