

import axios from 'axios';
import authHeader from '../services/auth-header';


const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"
const FETCH_IVOICE_REQUEST = 'FETCH_IVOICE_REQUEST';
const FETCH_IVOICE_SUCCESS = 'FETCH_IVOICE_SUCCESS';
const FETCH_IVOICE_FAILURE = 'FETCH_IVOICE_FAILURE';
const CREATE_INVOICE = 'CREATE_INVOICE';
const GET_INVOICES = 'GET_INVOICES';
const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';
const CREATE_INVOICE_ERROR = 'CREATE_INVOICE_ERROR';
const SEARCH_DATE_SUCCESS = "SEARCH_DATE_SUCCESS";
// const SEARCH_DATE_REQUEST = "SEARCH_DATE_REQUEST";
// const SEARCH_DATE_ERROR = "SEARCH_DATE_ERROR";
export const fetchInvoiceRequest = () => ({
  type: FETCH_IVOICE_REQUEST,
});

export const fetchInvoiceSuccess = (customers) => ({
  type: FETCH_IVOICE_SUCCESS,
  payload: customers,
});

export const fetchInvoiceFailure = (error) => ({
  type: FETCH_IVOICE_FAILURE,
  payload: error,
});


export const fetchInvoices = (query) => async (dispatch) => {
  dispatch(fetchInvoiceRequest());
  try {
    const response = await fetch(`http://localhost:5040/api/invoice/search-query?q=${query}`,{ headers: authHeader() });
    const data = await response.json();
    dispatch(fetchInvoiceSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchInvoiceRequest(error.message));
    throw error;
  }
};

  export const getAllInvoices = () => async (dispatch) => {
    try {
      const resp = await axios.get(`${API_URL_D}api/invoice/all`,{ headers: authHeader() });
  
      dispatch({ type: GET_INVOICES, payload: resp.data });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };
  


    


export const createInvoices = (invoiceData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL_D}api/invoice/create`, invoiceData,{ headers: authHeader() });
    dispatch({
      type: CREATE_INVOICE_SUCCESS,
      payload: data,
    });
    // Aquí podrías enviar una notificación de éxito al usuario
  } catch (error) {
    if (error.response && error.response.status ) {
      throw new Error("No se puedo crear la factura");
  
    }
    console.error(error)
    throw error;
    // Aquí podrías enviar una notificación de error al usuario
  
  }
};




// eslint-disable-next-line func-names
export const searchInvoiceByDate = (startDate, endDate) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL_D}api/report/invoices-by-date-range/${startDate}/${endDate}`,{ headers: authHeader() });
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



export const getClientPurchase =({id})=> async(dispatch)=>{

 
  try {
    const response = await axios.get(`${API_URL_D}api/report/client-stat/${id}`,{ headers: authHeader() }
    );
  
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchInvoiceFailure(error.message));
    return null
  }
};


export const getProductsBySeller=({id}) => async (dispatch) => {

  try {
    const response = await axios.get(`${API_URL_D}api/seller/seller-product-sales/${id}`,{ headers: authHeader() }
    );
  
    dispatch({
      type: SEARCH_DATE_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch(fetchInvoiceFailure(error.message));
    return null
  }
};



export const initialState = {
  invoices: [],
  message: null,
  error: null,
  sendInvoice: {},
};

export default function invoiceReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INVOICES:
      return {
        ...state,
        invoices: action.payload,
      };

    case CREATE_INVOICE:
      return {
        ...state,
        sendInvoice: action.payload,
      };

    case CREATE_INVOICE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isSuccess: false,
        invoice: null,
      };

      case SEARCH_DATE_SUCCESS:
        return{
      
          ...state,
          invoices:action.payload
      
        }
     

    default:
      return state;
  }
}
