const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('loanClient', {
      
          amount: {
            type: DataTypes.DECIMAL(10, 2),
           
          },
          issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
     
          notes: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          codigoClinte:{
            type:DataTypes.STRING

          },
          phoneNumber:{

            type:DataTypes.STRING

          }
     
        });
};
