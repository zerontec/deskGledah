// createDefaultRolesAndUsers.js

const { Role, User } = require('../db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear roles por defecto
    const roles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_FACTURACION'];
    await Promise.all(
      roles.map((role) => Role.findOrCreate({ where: { name: role } }))
    );

    // Crear usuarios por defecto con roles asignados
    await User.findOrCreate({
      where: {
        username: 'admin',
      },
      defaults: {
        password: 'admin',
      },
    }).then(([user, created]) => {
      if (created) {
        Role.findOne({ where: { name: 'ROLE_ADMIN' } }).then((role) => {
          user.setRoles([role]);
        });
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Puedes agregar la lógica para eliminar los roles y usuarios creados
    // si necesitas hacer una reversión de la seeder.
  },
};
