/* eslint-disable import/extensions */
//                o88o            o88o
//               o8888o          o8888o
//                 o888888oo0oo888888o
//                     8o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='



// _______  __       _______  _______       ___       __    __  
// /  _____||  |     |   ____||       \     /   \     |  |  |  | 
// |  |  __  |  |     |  |__   |  .--.  |   /  ^  \    |  |__|  | 
// |  | |_ | |  |     |   __|  |  |  |  |  /  /_\  \   |   __   | 
// |  |__| | |  `----.|  |____ |  '--'  | /  _____  \  |  |  |  | 
// \______| |_______||_______||_______/ /__/     \__\ |__|  |__| 



const server = require('./src/app.js');
const { conn } = require('./src/db.js');


const {  defaultAdminAndRoles } = require('./src/dbLoad/loadUser.js');

const port =  5040;


  // Syncing all the models at once.
  conn.sync({ force: false}).then(async() => {
    try {
      await defaultAdminAndRoles();
    } catch (err) {
      console.error('Error al crear roles y usuarios por defecto:', err);
    }

    server.listen(port, () => {
      console.log(`o|O_O|o robot Σωκράτης listening at ${port}`);
  
    });
  
  });
  
