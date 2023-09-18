const {Router} = require('express');
const { findAllNota, editNota, obtenerUnaNota, deleteNota, crearNotaDebito } = require('../controller/notaDebito.controller');

const router = Router();




router.get('/all-notes', findAllNota);
router.put('/update/:id', editNota);
router.get('/one-nota/:id', obtenerUnaNota)
router.delete('./delete/:id', deleteNota)
router.post('./create',crearNotaDebito)







module.exports = router;
