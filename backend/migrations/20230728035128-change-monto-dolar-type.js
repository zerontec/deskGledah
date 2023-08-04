;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('expenses', 'montoDolar', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Modifica esto según tus necesidades
      // Otros atributos de la columna si los tienes, como defaultValue, etc.
    });
  },


  async down (queryInterface, Sequelize) {
// Si necesitas revertir los cambios, aquí podrías volver a cambiar el tipo a lo que era antes
await queryInterface.changeColumn('expenses', 'montoDolar', {
  type: Sequelize.STRING, // Cambia esto según el tipo original de la columna
  allowNull: true, // Modifica esto según tus necesidades
  // Otros atributos de la columna si los tienes, como defaultValue, etc.
});
},
};
