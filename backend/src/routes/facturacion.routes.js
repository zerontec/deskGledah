const {Router} = require('express');
const { searchInvoiceByQuery, createInvoiceFactura, getAllInvoice, searchInvoicesByDate, getInvoiceDetails, getSalesCountByDate } = require('../controller/facturacion.controller');
const authJwt = require('../middleware/authJwt');

const router = Router();




router.post('/create',authJwt.verifyToken,authJwt.isAdminOrFacturacion , createInvoiceFactura);
router.get('/all',authJwt.verifyToken,authJwt.isAdminOrFacturacion , getAllInvoice);
router.get('/one/:id',authJwt.verifyToken, authJwt.isAdminOrFacturacion , getInvoiceDetails)
router.post('/search-byDate',authJwt.verifyToken, authJwt.isAdminOrFacturacion , searchInvoicesByDate)
router.get('/search-query',authJwt.verifyToken, authJwt.isAdminOrFacturacion , searchInvoiceByQuery)
router.get('/day-sales-count/:date',authJwt.verifyToken, authJwt.isAdminOrFacturacion , getSalesCountByDate)






module.exports = router;