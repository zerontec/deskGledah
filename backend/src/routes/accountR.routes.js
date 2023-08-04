const {Router}= require('express');
const { createAccountsReceivable, getAllAccountsReceivable, getAccountsReceivable,updateAccountsReceivable, deleteAccountsReceivable, createPayment, getAllPagoVentasID } = require('../controller/accountsReceivable.controller');
const authJwt = require('../middleware/authJwt');


const router = Router()


router.post('/create-account',authJwt.verifyToken, authJwt.isAdmin, createAccountsReceivable);
router.get('/all-account',authJwt.verifyToken, authJwt.isAdmin, getAllAccountsReceivable);
router.get('/detail-account/:id',authJwt.verifyToken, authJwt.isAdmin, getAccountsReceivable )
router.put('/update-account/:id',authJwt.verifyToken, authJwt.isAdmin, updateAccountsReceivable);
router.delete('/delete-account/:id',authJwt.verifyToken, authJwt.isAdmin, deleteAccountsReceivable);
router.post('/create-pay',authJwt.verifyToken, authJwt.isAdmin, createPayment);
router.post('/get-all-pay',authJwt.verifyToken, authJwt.isAdmin, getAllPagoVentasID);










module.exports=router;