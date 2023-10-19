const {Router} = require('express');
const {  editNota, obtenerUnaNota, deleteNota, crearNotaDebito, findAllNotaD } = require('../controller/notaDebito.controller');

const router = Router();




router.get('/all-notes', findAllNotaD);
router.put('/update/:id', editNota);
router.get('/one-nota/:id', obtenerUnaNota)
router.delete('./delete/:id', deleteNota)
router.post('./create',crearNotaDebito)







module.exports = router;
