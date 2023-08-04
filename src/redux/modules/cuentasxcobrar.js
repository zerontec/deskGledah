


import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_CUENTAS_REQUEST = 'FETCH_CUENTAS_REQUEST';
const FETCH_CUENTAS_SUCCESS = 'FETCH_CUENTAS_SUCCESS';
const FETCH_CUENTAS_FAILURE = 'FETCH_CUENTAS_FAILURE';

const CREATE_CUENTA = 'CREATE_CUENTA';
const GET_CUENTAS = 'GET_CUENTAS';
const CREATE_CUENTA_SUCCESS = 'CREATE_CUENTA_SUCCESS';
const CREATE_CUENTA_ERROR = 'CREATE_CUENTA_ERROR';
const  UPDATE_CUENTA =' UPDATE_CUENTA'
const DELETE_CUENTA='DELETE_CUENTA'
const CREATE_PAYMENT_CXC = 'CREATE_PAYMENT_CXC'



export const fetchCuentasRequest = () => ({
  type: FETCH_CUENTAS_REQUEST,
});

export const fetchCuentasSuccess = (customers) => ({
  type: FETCH_CUENTAS_SUCCESS,
  payload: customers,
});

export const fetchCuentasFailure = (error) => ({
  type: FETCH_CUENTAS_FAILURE,
  payload: error,
});


export const fetchCuentas = (query) => async (dispatch) => {
  dispatch(fetchCuentasRequest());
  try {
    const response = await axios.get(`${API_URL_D}api/invoice/search-query?q=${query}`,{ headers: authHeader() });
    const data = await response.json();
    dispatch(fetchCuentasSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchCuentasRequest(error.message));
    throw error;
  }
};

  export const getAllCuentas = () => async (dispatch) => {
    try {
      const resp = await axios.get(`${API_URL_D}api/account-receivable/all-account`,{ headers: authHeader() });
  
      dispatch({ type: GET_CUENTAS, payload: resp.data });
  
      return resp.data;
    } catch (err) {
      throw err.response;
    }
  };
  





export const createCuenta = (invoiceData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL_D}api/invoice/create`, invoiceData,{ headers: authHeader() });
    dispatch({
      type: CREATE_CUENTA_SUCCESS,
      payload: data,
    });
    // Aquí podrías enviar una notificación de éxito al usuario
  } catch (error) {
    dispatch({
      type: CREATE_CUENTA_ERROR,
      payload: error.response.data.message,
    });
    // Aquí podrías enviar una notificación de error al usuario
  }
};

export const updateCuenta = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/product/update/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_CUENTA,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };




  export const createAbonocxc = (data) => async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL_D}api/account-receivable/create-pay`, data, { headers: authHeader() });
      dispatch({
        type: CREATE_PAYMENT_CXC,
        payload: response.data,
      });
      return response.data;
      // Aquí podrías enviar una notificación de éxito al usuario
    } catch (error) {
      if (error.response && error.response.status) {
        throw new Error('No se puedo crear el abono');
      }
      console.error(error);
      throw error;
      // Aquí podrías enviar una notificación de error al usuario
    }
  };




  export const deleteCuenta = (id) => async (dispatch) => {
    try {
      await axios.delete(`${API_URL_D}api/product/delete/${id}`,{ headers: authHeader() });
  
      dispatch({
        type: DELETE_CUENTA,
        payload: { id },
      });
      return({message:"Eliminado con exito"})
    } catch (err) {
      return err.response;
    }
  };













export const initialState = {
  cuentas: [],
  message: null,
  error: null,
  sendCuentas: {},
};

export default function cuentasxcReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CUENTAS:
      return {
        ...state,
        cuentas: action.payload,
      };

    case CREATE_CUENTA:
      return {
        ...state,
        sendcuentas: action.payload,
      };

    case CREATE_CUENTA_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isSuccess: false,
        cuentas: null,
      };

      case CREATE_PAYMENT_CXC:
        return {
          ...state,
          payables: action.payload,
        };
     

    default:
      return state;
  }
}
