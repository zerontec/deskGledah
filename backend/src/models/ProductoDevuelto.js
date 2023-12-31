const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('productoDevuelto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          barcode: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          cantidadDevuelta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          invoiceNumber:{

               type:DataTypes.STRING 
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
          fechaDevolucion: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          productid:{

            type:DataTypes.INTEGER
          }
        
        });
};
