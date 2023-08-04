const {Router}= require('express');
const { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, getWeeklyExpenses, getMonthlyExpenses } = require('../controller/expense.controller');

const router =Router();



router.get('/get-all', getExpenses);
router.get('/get-expense/:id', getExpenseById);
router.post('/create', createExpense);
router.put('/update/:id', updateExpense);
router.delete('/delete/:id', deleteExpense);
router.get('/get-weekend-expenses', getWeeklyExpenses)
router.get('/get-montly-expenses',getMonthlyExpenses)






module.exports = router;
