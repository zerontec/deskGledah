const {Router}=require('express');
const { createLoan, getLoansBySeller, getAllLoan, updateLoanStatus, deleteLoan, createPayment, updatePayment, getCompletedPayments, getLoansByCustomer } = require('../controller/loanCustomer.controller');
const authJwt = require('../middleware/authJwt');


const router = Router();

router.get('/get-all-loan',authJwt.verifyToken, authJwt.isAdmin, getAllLoan);
router.post('/get-payments',authJwt.verifyToken, authJwt.isAdmin, getLoansByCustomer);
router.post('/create', authJwt.verifyToken, authJwt.isAdmin,createLoan);
router.put('/update/:id',authJwt.verifyToken, authJwt.isAdmin, updateLoanStatus);
router.delete('/delete/:id',authJwt.verifyToken, authJwt.isAdmin, deleteLoan);
router.post('/payment',authJwt.verifyToken, authJwt.isAdmin, createPayment)
router.put('/update-payment/:id',authJwt.verifyToken, authJwt.isAdmin, updatePayment);
router.get('/get-all-payment',authJwt.verifyToken, authJwt.isAdmin, getCompletedPayments)
router.get('/get-completed-payment', getCompletedPayments);

// router.delete('/delete/:id', deleteLoan);











module.exports=router