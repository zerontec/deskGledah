const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "SA Gledah",
  });

  const url = isDev
    ? 'http://localhost:3000/' // URL de desarrollo de React
    : `file://${path.join(__dirname, '../build/index.html')}`; // URL de producción

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // const backendProcess = exec('node ./backend/index.js', (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error al iniciar el servidor backend: ${error}`);
  //   }
  //   console.log(`Salida del servidor backend: ${stdout}`);
  //   console.error(`Error del servidor backend: ${stderr}`);
  // });

  
  const backendProcess = spawn('node', ['backend/index.js'], { cwd: path.join(__dirname, '../') });
  backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

  console.log('El backend se está iniciando...');
// Función para manejar el evento before-quit
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

  // Cuando todas las ventanas de Electron estén cerradas, detener el servidor backend
  app.on('window-all-closed', () => {
    // Detener el servidor backend si está en ejecución
    if (backendProcess) {
      backendProcess.kill();
    }
  });

  backendProcess.on('close', (code) => {
    console.log(`El backend se ha cerrado con el código de salida: ${code}`);
  });

  backendProcess.on('error', (error) => {
    console.error(`Error al iniciar el backend: ${error.message}`);
  });

  // Salir de la aplicación si no estás en macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
