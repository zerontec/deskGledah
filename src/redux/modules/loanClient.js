


import axios from 'axios';
import authHeader from '../services/auth-header';


const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"
const FETCH_LOANCLIENT_REQUEST = 'FETCH_LOANCLIENT_REQUEST';
const FETCH_LOANCLIENT_SUCCESS = 'FETCH_LOANCLIENT_SUCCESS';
const FETCH_LOANCLIENT_FAILURE = 'FETCH_LOANCLIENT_FAILURE';
const CREATE_LOANCLIENT = 'CREATE_LOANCLIENT';
const GET_LOAN_CLIENTS = 'GET_LOANCLIENTS';
const CREATE_LOAN_CLIENT_SUCCESS = 'CREATE_LOANCLIENT_SUCCESS';
const CREATE_LOAN_CLIENT_ERROR = 'CREATE_LOANCLIENT_ERROR';
const SEARCH_DATE_SUCCESS = "SEARCH_DATE_SUCCESS";
const UPDATE_LOAN_CLIENT = "UPDATE_LOANCLIENT"
const DELETE_LOAN_CLIENT ="DELETE_LOANCLIENT"
const CREATE_PAYMENT_SUCCESS ='CREATE_PAYMENT_SUCCESS'
const CREATE_PAYMENT='CREATE_PAYMENT'
const UPDATE_PAYMENT= 'UPDATE_PAYMENT'
// const SEARCH_DATE_REQUEST = "SEARCH_DATE_REQUEST";
// const SEARCH_DATE_ERROR = "SEARCH_DATE_ERROR";
export const fetchLoanClientRequest = () => ({
  type: FETCH_LOANCLIENT_REQUEST,
});

export const fetchLoanClientSuccess = (customers) => ({
  type: FETCH_LOANCLIENT_SUCCESS,
  payload: customers,
});

export const fetchLoanClientFailure = (error) => ({
  type: FETCH_LOANCLIENT_FAILURE,
  payload: error,
});


export const fetchLoansClient = (query) => async (dispatch) => {
  dispatch(fetchLoanClientRequest());
  try {
    const response = await fetch(`http://localhost:5040/api/loanCustomer/search-query?q=${query}`,{ headers: authHeader() });
    const data = await response.json();
    dispatch(fetchLoanClientSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchLoanClientRequest(error.message));
    throw error;
  }
};

  export const getAllLoansClient = () => async (dispatch) => {
    try {
      const resp = await axios.get(`${API_URL_D}api/loanCustomer/get-all-loan`,{ headers: authHeader() });
  
      dispatch({ type: GET_LOAN_CLIENTS, payload: resp.data });
  
      return resp.data;
    } catch (err) {
      throw err.response;
    }
  };
  


    


export const createLoansClient = (invoiceData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL_D}api/loanCustomer/create`, invoiceData,{ headers: authHeader() });
    dispatch({
      type: CREATE_LOAN_CLIENT_SUCCESS,
      payload: data,
    });
    // Aquí podrías enviar una notificación de éxito al usuario
  } catch (error) {
    if (error.response && error.response.status ) {
      throw new Error("No se puedo crear la Deuda");
  
    }
    console.error(error)
    throw error;
    // Aquí podrías enviar una notificación de error al usuario
  
  }
};


export const createPaymentClient = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/loanCustomer/payment`, data,{ headers: authHeader() });
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
export const searchLoanByDateClient = (startDate, endDate) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL_D}api/loanCustomer/invoices-by-date-range/${startDate}/${endDate}`,{ headers: authHeader() });
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: "No existen facturas para ese rango de fechas" });
    }
    throw error;
  }
};



export const updateLoandClient = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/loanCustomer/update/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_LOAN_CLIENT,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };


  export const updatePaymentClient = (id, data) => async (dispatch) => {
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






  export const deleteUploadClient =(id) => async (dispatch)=> {

try{
    const resp = await axios.delete(`${API_URL_D}api/loanCustomer/delete/${id}`,{ headers: authHeader() })
    dispatch({
    type:DELETE_LOAN_CLIENT,
    payload:resp.data

    });

return resp.data;

}catch(error){

   return error.response

}
  



  }

export const getLoanByClient=({id}) => async (dispatch) => {

  try {
    const response = await axios.get(`${API_URL_D}api/loan/seller-product-sales/${id}`,{ headers: authHeader() }
    );
  
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchLoanClientFailure(error.message));
    return null
  }
};


export const getAllPaymentClient=() => async (dispatch) => {

  try {
    const response = await axios.get(`${API_URL_D}api/loanCustomer/get-all-payment`,{ headers: authHeader() }
    );
  
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchLoanClientFailure(error.message));
    return null
  }
};



export const initialState = {
  loansClients: [],
  message: null,
  error: null,
  sendLoan: {},
};

export default function loanClientsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LOAN_CLIENTS:
      return {
        ...state,
        loansClients: action.payload,
      };

    case CREATE_PAYMENT:
      return {
        ...state,
        loansClients: action.payload,
      };
      
    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        sendLoan: action.payload,
      };


    case CREATE_LOAN_CLIENT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isSuccess: false,
        loansClients: null,
      };

      case SEARCH_DATE_SUCCESS:
        return{
      
          ...state,
          loansClients:action.payload
      
        }
        case UPDATE_LOAN_CLIENT:
            return{
            ...state,
            loansClients:action.payload
    
    
            }
            case UPDATE_PAYMENT:
              return{
              ...state,
              loansClients:action.payload
      
      
              }

            case DELETE_LOAN_CLIENT:
                return{


                    ...state,
                    
                }
     

    default:
      return state;
  }
}
