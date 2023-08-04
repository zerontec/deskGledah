
import axios from 'axios'
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"

const FETCH_EXPENSE_REQUEST = 'FETCH_PRODUCT_REQUEST'
const FETCH_EXPENSE_SUCCESS ='FETCH_PRODUCT_SUCCESS'
const FETCH_EXPENSE_FAILURE = 'FETCH_PRODUCT_FAILURE'
const CREATE_EXPENSE= 'CREATE_PRODUCT'
const GET_ALL_EXPENSE = 'GET_ALL_PRODUCTS'
const UPDATE_EXPENSE ='UPDATE_PRODUCT'
const DELETE_EXPENSE ='DELETE_PRODUCT'

const GET_ALL_MONTLY_EXPENSE ='GET_ALL_MONTLY_EXPENSE'

export const fetchExpenseRequest = () => ({
    type: FETCH_EXPENSE_REQUEST,
  });
  
  export const fetchExpenseSuccess = (expenses) => ({
    type: FETCH_EXPENSE_SUCCESS,
    payload: expenses,
  });
  
  export const fetchExpenseFailure = (error) => ({
    type: FETCH_EXPENSE_FAILURE,
    payload: error,
  });
  

  
  export const fetchExpenses = (query) => async (dispatch) => {
    dispatch(fetchExpenseRequest());
    try {
      const response = await fetch(`${API_URL_D}api/expenses/search-query?q=${query}`,{ headers: authHeader() });
      const data = await response.json();
      dispatch(fetchExpenseSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchExpenseFailure(error.message));
      return null; // O devuelve otro valor adecuado en caso de error
    }
  };
  
    export const createExpense = (formInfo) => async (dispatch) => {
      try {
        const  {data}= await axios.post(`${API_URL_D}api/expenses/create`, formInfo,{ headers: authHeader() });
        dispatch({
          type: CREATE_EXPENSE,
          payload: data,
        });
        return data;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          throw new Error("El código ya existe. Ingrese otro.");
        }
        throw error;
      }
    };


    
   

   
    
   export const getMonthlyExpenses  =() =>async (dispatch)=>{
    
    try {
       const resp = await axios.get(`${API_URL_D}api/expenses/get-montly-expenses `,{ headers: authHeader() });
 
       dispatch({
         type: GET_ALL_MONTLY_EXPENSE,
         payload: resp.data,
       });
       return resp.data
     } catch (err) {
       return err.response;
     }
   };
 
    
    
    
    
    

  export const getAllExpense =() =>async (dispatch)=>{
    
     try {
        const resp = await axios.get(`${API_URL_D}api/expenses/get-all `,{ headers: authHeader() });
  
        dispatch({
          type: GET_ALL_EXPENSE,
          payload: resp.data,
        });
        return resp.data
      } catch (err) {
        return err.response;
      }
    };
  
  


    export const updateExpense = (id, data) => async (dispatch) => {
      try {
        const resp = await axios.put(`${API_URL_D}api/expenses/update/${id}`, data,{ headers: authHeader() });
    
        dispatch({
          type: UPDATE_EXPENSE,
          payload: resp.data,
        });
    
        return resp.data;
      } catch (err) {
        return err.response;
      }
    };


    export const deleteExpense = (id) => async (dispatch) => {
      try {
        await axios.delete(`${API_URL_D}api/expenses/delete/${id}`,{ headers: authHeader() });
    
        dispatch({
          type: DELETE_EXPENSE,
          payload: { id },
        });
        return({message:"Eliminado con exito"})
      } catch (err) {
        return err.response;
      }
    };





  export const initialState = {
    expenses: [],
    message: null,
    error: null,
   sendExpenses:{}
    
  };

  export default function expenseReducer(state = initialState, action) {
    switch (action.type) {


      case GET_ALL_EXPENSE:
        return {
          ...state,
          expenses: action.payload,
        };
   

          case GET_ALL_MONTLY_EXPENSE:
            return {
              ...state,
              expenses: action.payload,
            };
  
  


      case CREATE_EXPENSE:
        return {
          ...state,
          expenses: action.payload,
        };
      
  
        case FETCH_EXPENSE_REQUEST:
          return{
            ...state,
          isLoading: true,
          error: null
      
          }

          case FETCH_EXPENSE_SUCCESS:
            return{

                ...state,
                isLoading: false,
                expenses:action.payload


            }
            case FETCH_EXPENSE_FAILURE:
                return {
                  ...state,
                  isLoading: false,
                  error: action.payload
                };

                case DELETE_EXPENSE:
                  return{
                      ...state

                  };

               
                    case UPDATE_EXPENSE:
                      return{
                      ...state,
                      expenses:action.payload
              
              
                      }
  
      default:
        return state;
    }
  }
  

