const sequelize = require('sequelize')

const { Op } = require("sequelize");
const { DailySales } = require('../db');
// const WebSocket = require('ws');


// const wss = new WebSocket.Server({ port: 8090 });

// let clients = []; // Almacena las referencias de los clientes WebSocket conectados

const getDailySales = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const result = await DailySales.findOne({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'totalSales']],
    });

    let totalSales = 0;
    if (result && result.dataValues.totalSales) {
      totalSales = result.dataValues.totalSales;
    }

    res.status(200).json({ message: 'Ventas del día', totalSales });
  } catch (error) {
    next(error);
  }
};

// wss.on('connection', (ws) => {
//   clients.push(ws); // Agrega el cliente WebSocket a la lista de clientes conectados

//   // Maneja el mensaje enviado por el cliente WebSocket
//   ws.on('message', (message) => {
//     console.log('Received message:', message);
//   });

//   // Maneja el cierre de conexión por parte del cliente WebSocket
//   ws.on('close', () => {
//     clients = clients.filter((client) => client !== ws); // Elimina el cliente WebSocket de la lista de clientes conectados
//     console.log('Connection closed');
//   });
// });

// Función para enviar el total de ventas a todos los clientes WebSocket conectados
// const sendTotalSalesToClients = (totalSales) => {
//   const message = JSON.stringify({ totalSales });
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// };

module.exports = {
  getDailySales,
  // sendTotalSalesToClients,
};
