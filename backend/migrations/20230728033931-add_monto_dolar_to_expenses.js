

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('expenses', 'montoDolar', {
      type: Sequelize.FLOAT, // Cambia el tipo de dato según corresponda
      allowNull: true, // Cambia a false si la columna no permite valores nulos
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('expenses', 'montoDolar');
  }
};
