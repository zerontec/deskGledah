const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

async function runMigrations() {
  // Configurar la conexión a la base de datos con Sequelize
  const sequelize = new Sequelize(/* configuración de la base de datos */);

  // Crear una instancia de Umzug
  const umzug = new Umzug({
    storage: 'sequelize', // Indicar que las migraciones se guardarán en Sequelize
    storageOptions: { sequelize }, // Pasar la instancia de Sequelize
    migrations: {
      path: './migrations', // Ruta donde se encuentran los archivos de migración
      params: [sequelize.getQueryInterface(), Sequelize], // Pasar objetos adicionales a las migraciones (opcional)
    },
  });

  try {
    // Obtener la lista de migraciones pendientes
    const pendingMigrations = await umzug.pending();

    // Si hay migraciones pendientes, ejecutarlas
    if (pendingMigrations.length > 0) {
      await umzug.up();
      console.log('Migraciones ejecutadas correctamente.');
    } else {
      console.log('No hay migraciones pendientes.');
    }
  } catch (error) {
    console.error('Error al ejecutar las migraciones:', error);
  }
}

// Llamar a la función para ejecutar las migraciones al iniciar la aplicación
runMigrations();
