

import axios from 'axios';
import authHeader from '../services/auth-header';


const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"
const FETCH_LOAN_REQUEST = 'FETCH_LOAN_REQUEST';
const FETCH_LOAN_SUCCESS = 'FETCH_LOAN_SUCCESS';
const FETCH_LOAN_FAILURE = 'FETCH_LOAN_FAILURE';
const CREATE_LOAN = 'CREATE_LOAN';
const GET_LOANS = 'GET_LOANS';
const CREATE_LOAN_SUCCESS = 'CREATE_LOAN_SUCCESS';
const CREATE_LOAN_ERROR = 'CREATE_LOAN_ERROR';
const SEARCH_DATE_SUCCESS = "SEARCH_DATE_SUCCESS";
const UPDATE_LOAND = "UPDATE_LOAN"
const DELETE_LOAN ="DELETE_LOAN"
const CREATE_PAYMENT_SUCCESS ='CREATE_PAYMENT_SUCCESS'
const CREATE_PAYMENT='CREATE_PAYMENT'
const UPDATE_PAYMENT= 'UPDATE_PAYMENT'
// const SEARCH_DATE_REQUEST = "SEARCH_DATE_REQUEST";
// const SEARCH_DATE_ERROR = "SEARCH_DATE_ERROR";
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

  export const getAllLoans = () => async (dispatch) => {
    try {
      const resp = await axios.get(`${API_URL_D}api/loan/get-all`,{ headers: authHeader() });
  
      dispatch({ type: GET_LOANS, payload: resp.data });
  
      return resp.data;
    } catch (err) {
      throw err.response;
    }
  };
  


    


export const createLoans = (invoiceData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL_D}api/loan/create`, invoiceData,{ headers: authHeader() });
    dispatch({
      type: CREATE_LOAN_SUCCESS,
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
export const searchLoanByDate = (startDate, endDate) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL_D}api/loan/invoices-by-date-range/${startDate}/${endDate}`,{ headers: authHeader() });
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



export const updateLoand = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/loan/update/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_LOAND,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };


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






  export const deleteUpload =(id) => async (dispatch)=> {

try{
    const resp = await axios.delete(`${API_URL_D}api/loan/delete/${id}`,{ headers: authHeader() })
    dispatch({
    type:DELETE_LOAN,
    payload:resp.data

    });

return resp.data;

}catch(error){

   return error.response

}
  



  }

export const getLoanBySeller=({id}) => async (dispatch) => {

  try {
    const response = await axios.get(`${API_URL_D}api/loan/seller-product-sales/${id}`,{ headers: authHeader() }
    );
  
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchLoanFailure(error.message));
    return null
  }
};


// export const getAllPayment=() => async (dispatch) => {

//   try {
//     const response = await axios.get(`${API_URL_D}api/loan/get-all-payment`,{ headers: authHeader() }
//     );
  
//     dispatch({
//       type: SEARCH_DATE_SUCCESS,
//       payload: response.data,
//     });
//     return response.data;
//   } catch (error) {
//     dispatch(fetchLoanFailure(error.message));
//     return null
//   }
// };



export const initialState = {
  loans: [],
  message: null,
  error: null,
  sendLoan: {},
};

export default function loanReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LOANS:
      return {
        ...state,
        loans: action.payload,
      };

    case CREATE_PAYMENT:
      return {
        ...state,
        loans: action.payload,
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
        loans: null,
      };

      case SEARCH_DATE_SUCCESS:
        return{
      
          ...state,
          loans:action.payload
      
        }
        case UPDATE_LOAND:
            return{
            ...state,
            loans:action.payload
    
    
            }
            case UPDATE_PAYMENT:
              return{
              ...state,
              loans:action.payload
      
      
              }

            case DELETE_LOAN:
                return{


                    ...state,
                    
                }
     

    default:
      return state;
  }
}
