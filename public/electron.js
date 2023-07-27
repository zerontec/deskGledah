/* eslint-disable import/extensions */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const server = require('../src/backend/src/app.js');
const { conn } = require('../src/backend/src/db.js');
const { defaultAdminAndRoles } = require('../src/backend/src/dbLoad/loadUser.js');

const port = 5040;
let backendProcess;

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
  conn.sync({ force: false }).then(async () => {
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
