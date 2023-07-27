

import axios from 'axios';
import authHeader from '../services/auth-header';


const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"
const FETCH_LOAN_REQUEST = 'FETCH_LOAN_REQUEST';
const FETCH_LOAN_SUCCESS = 'FETCH_LOAN_SUCCESS';
const FETCH_LOAN_FAILURE = 'FETCH_LOAN_FAILURE';

const GET_LOANS = 'GET_LOANS';
const CREATE_LOAN_SUCCESS = 'CREATE_LOAN_SUCCESS';
const CREATE_LOAN_ERROR = 'CREATE_LOAN_ERROR';
const SEARCH_DATE_SUCCESS = "SEARCH_DATE_SUCCESS";

const CREATE_PAYMENT_SUCCESS ='CREATE_PAYMENT_SUCCESS'
const CREATE_PAYMENT='CREATE_PAYMENT'
const UPDATE_PAYMENT= 'UPDATE_PAYMENT'
const GET_ALL_PAYMENT='GET_ALL_PAYMENT'



export const fetchLoanRequest = () => ({
  type: FETCH_LOAN_REQUEST,
});

export const fetchLoanSuccess = (customers) => ({
  type: FETCH_LOAN_SUCCESS,
  payload: customers,
});

export const fetchLoanFailure = (error) => ({
  type: FETCH_LOAN_FAILURE,
  payload: error,
});


export const fetchLoans = (query) => async (dispatch) => {
  dispatch(fetchLoanRequest());
  try {
    const response = await fetch(`http://localhost:5040/api/loan/search-query?q=${query}`,{ headers: authHeader() });
    const data = await response.json();
    dispatch(fetchLoanSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchLoanRequest(error.message));
    throw error;
  }
};




    




export const createPayment = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/loan/payment`, data,{ headers: authHeader() });
    dispatch({
      type: CREATE_PAYMENT,
      payload: response.data,
    });
    return response.data;
    // Aquí podrías enviar una notificación de éxito al usuario
  } catch (error) {
    if (error.response && error.response.status ) {
      throw new Error("No se puedo crear el abono");
  
    }
    console.error(error)
    throw error;
    // Aquí podrías enviar una notificación de error al usuario
  
  }
};





// eslint-disable-next-line func-names




  export const updatePayment = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/loan/update-payment/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_PAYMENT,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };






 



export const getAllPayment=() => async (dispatch) => {

  try {
    const response = await axios.get(`${API_URL_D}api/loan/get-all-payment`,{ headers: authHeader() }
    );
  
    dispatch({
      type:GET_ALL_PAYMENT,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchLoanFailure(error.message));
    return null
  }
};



export const initialState = {
  payments: [],
  message: null,
  error: null,
  sendLoan: {},
};

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {



    case GET_ALL_PAYMENT:
        return {
          ...state,
          payments: action.payload,
        };
  


    case CREATE_PAYMENT:
      return {
        ...state,
        payments: action.payload,
      };
      
    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        sendLoan: action.payload,
      };


    case CREATE_LOAN_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isSuccess: false,
        payments: null,
      };

      case SEARCH_DATE_SUCCESS:
        return{
      
          ...state,
          payments:action.payload
      
        }
      
            case UPDATE_PAYMENT:
              return{
              ...state,
              payments:action.payload
      
      
              }

     

    default:
      return state;
  }
}
