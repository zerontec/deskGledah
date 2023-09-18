const {Router} = require('express');
const { crearDevolucionCompra, obtenerDevolucionCompra, obtenerDevolucionesCompras, editDevolucionCompra } = require('../controller/devolucionCompra.controller');

const router = Router();





router.post('/devolution', crearDevolucionCompra);
router.get('/all-devolucion', obtenerDevolucionCompra);
router.get('/one/:id', obtenerDevolucionesCompras)
router.put('/update/:id', editDevolucionCompra)






module.exports=router