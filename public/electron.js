/* eslint-disable import/extensions */
const { app, BrowserWindow,dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const server = require('../backend/src/app.js');
const { conn } = require('../backend/src/db.js');
const { defaultAdminAndRoles } = require('../backend/src/dbLoad/loadUser.js');
// const { runMigrations } = require('../backend/runMigration'); 

const port = 5040;
let backendProcess;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// Deshabilitar la consola emergente de actualización automática
autoUpdater.autoInstallOnAppQuit = false;

// Establecer el feedURL (la dirección de tu repositorio de GitHub)
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'zerontec',
  repo: 'deskGledah',
  url: "https://github.com/zerontec/deskGledah/releases"
});
// Eventos de actualización
autoUpdater.on('update-available', (info) => {
  // Aquí puedes mostrar una notificación o mensaje en la interfaz de usuario
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización disponible',
    message: 'Hay una nueva versión disponible. ¿Deseas actualizar?',
    buttons: ['Actualizar', 'Cancelar'],
    defaultId: 0,
  }).then((response) => {
    if (response.response === 0) {
      // Si el usuario decide actualizar, comienza la instalación en segundo plano
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  // Aquí puedes mostrar una notificación o mensaje en la interfaz de usuario
  dialog.showMessageBox({
    type: 'info',
    title: 'Sin actualizaciones',
    message: 'Ya tienes la última versión instalada.',
    buttons: ['OK'],
    defaultId: 0,
  });
});

autoUpdater.on('error', (err) => {
  // Aquí puedes mostrar una notificación o mensaje en la interfaz de usuario
  dialog.showErrorBox('Error al buscar actualizaciones', err.message || '');
});

// Evento cuando la actualización ha sido descargada y está lista para instalarse
autoUpdater.on('update-downloaded', (info) => {
  // Aquí puedes mostrar una notificación o mensaje en la interfaz de usuario
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización lista',
    message: 'La actualización ha sido descargada y está lista para instalarse. ¿Deseas reiniciar ahora?',
    buttons: ['Reiniciar', 'Cancelar'],
    defaultId: 0,
  }).then((response) => {
    if (response.response === 0) {
      // Si el usuario decide reiniciar, cierra la aplicación y reinicia automáticamente
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  });
});

// Verificar actualizaciones automáticamente al iniciar la aplicación
app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});







function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Gledah",
  });

  const url = isDev
    ? 'http://localhost:3000/' // URL de desarrollo de React
    : `file://${path.join(__dirname, '../build/index.html')}`; // URL de producción

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  backendProcess = server.listen(port, () => {
    console.log(`o|O_O|o robot Σωκράτης listening at ${port}`);
  });

  // Salir de la aplicación si no estás en macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  // Sincronizar los modelos de la base de datos antes de crear la ventana
  // runMigrations();
  
  conn.sync({ force: false}).then(async () => {
    try {
      await defaultAdminAndRoles();
    } catch (err) {
      console.error('Error al crear roles y usuarios por defecto:', err);
    }
    
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Cerrar el servidor del backend si está en ejecución
  if (backendProcess) {
    backendProcess.close(() => {
      console.log('El servidor del backend se ha cerrado correctamente.');
      app.quit();
    });
  } else {
    app.quit();
  }
});
