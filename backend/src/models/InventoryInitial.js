const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('InventoryInitial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER, // Aquí debería ser el tipo correcto de tu clave foránea
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo: {
      type: DataTypes.FLOAT,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
