const { Router } = require('express');
const {
  createProductInventory,
  findAllProductsInventory,
  updateInventoryProduct,
  getProductById,
  deleteProduct,
  moveProductToStore,
  registrarInventarioInicial,
  registrarInventarioFinal,
  realizarCierreMensual,
  showInventoriInitial,
} = require('../controller/invetory.controller');

const authJwt = require('../middleware/authJwt');

const router = Router();

router.post('/add-inventory', authJwt.verifyToken, authJwt.isAdmin, createProductInventory);
router.get('/all-products-inventory', authJwt.verifyToken, authJwt.isAdmin, findAllProductsInventory);
router.post('/update-inventory-product', authJwt.verifyToken, authJwt.isAdmin, updateInventoryProduct);
router.get('/one-product-inventory/:id', authJwt.verifyToken, authJwt.isAdmin, getProductById);
router.delete('/delete-product-inventory/:id', authJwt.verifyToken, authJwt.isAdmin, deleteProduct);
router.post('/move-to-store', authJwt.verifyToken, authJwt.isAdmin, moveProductToStore);
router.post('/inventario-inicial', registrarInventarioInicial);
router.post('/inventario-final', registrarInventarioFinal);
router.get('/cierre-mensual/:fechaInicio/:fechaFin', realizarCierreMensual);
router.get('/show-inventory-initial/:fechaInicio/:fechaFin', showInventoriInitial);

module.exports = router;
