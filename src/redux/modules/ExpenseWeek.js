
import axios from 'axios'
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"



export const FETCH_WEEKLY_EXPENSES_SUCCESS ='FETCH_WEEKLY_EXPENSES_SUCCESS';
export const FETCH_WEEKLY_EXPENSES_FAILURE ='FETCH_WEEKLY_EXPENSES_FAILURE';

export const getWeeklyExpenses = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL_D}api/expenses/get-weekend-expenses`);
    const { totalExpense, totalExpenseDolar } = response.data;

    dispatch({
      type: FETCH_WEEKLY_EXPENSES_SUCCESS,
      totalExpense,
      totalExpenseDolar,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    dispatch({
      type: FETCH_WEEKLY_EXPENSES_FAILURE,
      error: error.message,
    });
  }
};
const initialState = {
    totalExpense: 0,
    totalExpenseDolar: 0,
    error: null,
  };
  
  export default function expenseWeekReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_WEEKLY_EXPENSES_SUCCESS:
        return {
          ...state,
          totalExpense: action.totalExpense,
          totalExpenseDolar: action.totalExpenseDolar,
          error: null,
        };
      case FETCH_WEEKLY_EXPENSES_FAILURE:
        return {
          ...state,
          error: action.error,
        };
      default:
        return state;
    }
  }