const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const { spawn } = require('child_process');
// const isDev = require('electron-is-dev');
const { exec } = require('child_process');


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const url = 'http://localhost:3000/'; // URL de desarrollo de React
  mainWindow.loadURL(url);

  exec('node ./backend/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al iniciar el servidor backend: ${error}`);
    }
    console.log(`Salida del servidor backend: ${stdout}`);
    console.error(`Error del servidor backend: ${stderr}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
