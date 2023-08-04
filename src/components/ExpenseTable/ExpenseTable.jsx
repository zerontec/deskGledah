import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWeeklyExpenses } from '../../redux/modules/ExpenseWeek';



const ExpenseTable = () => {
  const dispatch = useDispatch();

  const { totalExpense, totalExpenseDolar } = useSelector((state) => state.expenseWeek);

  useEffect(() => {
    dispatch(getWeeklyExpenses());
  }, [dispatch]);



  return (
    <>
      <>
        <h3>Total Gasto de la Semana: Bs {totalExpense.toFixed(2)}</h3>
        <h3>Total Gasto de la Semana en Dólares: $ {totalExpenseDolar.toFixed(2)}</h3>
      </>
    </>
  );
};



export default ExpenseTable;
