import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';

const FETCH_PAYABLES_REQUEST = 'FETCH_PAYABLES_REQUEST';
const FETCH_PAYABLES_SUCCESS = 'FETCH_PAYABLES_SUCCESS';
const FETCH_PAYABLES_FAILURE = 'FETCH_PAYABLES_FAILURE';

const CREATE_PAYABLE = 'CREATE_PAYABLE';
const GET_PAYABLES = 'GET_PAYABLES';
const CREATE_PAYABLE_SUCCESS = 'CREATE_PAYABLE_SUCCESS';
const CREATE_PAYABLE_ERROR = 'CREATE_PAYABLE_ERROR';
const UPDATE_PAYABLE = ' UPDATE_PAYABLE';
const DELETE_PAYABLE = 'DELETE_PAYABLE';
const CREATE_PAYMENT = 'CREATE_PAYMENT';
const GET_ALL_PAYMENT = 'GET_ALL_PAYMENT';

export const fetchPayablesRequest = () => ({
  type: FETCH_PAYABLES_REQUEST,
});

export const fetchPayablesSuccess = (customers) => ({
  type: FETCH_PAYABLES_SUCCESS,
  payload: customers,
});

export const fetchPAyablesFailure = (error) => ({
  type: FETCH_PAYABLES_FAILURE,
  payload: error,
});

export const fetchPAYABLES = (query) => async (dispatch) => {
  dispatch(fetchPayablesRequest());
  try {
    const response = await axios.get(`${API_URL_D}api/invoice/search-query?q=${query}`, { headers: authHeader() });
    const data = await response.json();
    dispatch(fetchPayablesSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchPayablesRequest(error.message));
    throw error;
  }
};

export const getAllPayables = () => async (dispatch) => {
  try {
    const resp = await axios.get(`${API_URL_D}api/account-payable/all-account-payable`, { headers: authHeader() });

    dispatch({ type: GET_PAYABLES, payload: resp.data });

    return resp.data;
  } catch (err) {
    console.error('Error fetching invoices:', err);
    throw err.response;
  }
};

export const createPayable = (invoiceData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL_D}api/invoice/create`, invoiceData, { headers: authHeader() });
    dispatch({
      type: CREATE_PAYABLE_SUCCESS,
      payload: data,
    });
    // Aquí podrías enviar una notificación de éxito al usuario
  } catch (error) {
    dispatch({
      type: CREATE_PAYABLE_ERROR,
      payload: error.response.data.message,
    });
    // Aquí podrías enviar una notificación de error al usuario
  }
};

export const updatePayable = (id, data) => async (dispatch) => {
  try {
    const resp = await axios.put(`${API_URL_D}api/product/update/${id}`, data, { headers: authHeader() });

    dispatch({
      type: UPDATE_PAYABLE,
      payload: resp.data,
    });

    return resp.data;
  } catch (err) {
    return err.response;
  }
};

export const deletePayable = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/product/delete/${id}`, { headers: authHeader() });

    dispatch({
      type: DELETE_PAYABLE,
      payload: { id },
    });
    return { message: 'Eliminado con exito' };
  } catch (err) {
    return err.response;
  }
};

export const createAbonocxp = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/account-payable/create-pay`, data, { headers: authHeader() });
    dispatch({
      type: CREATE_PAYMENT,
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
export const getAllAbonoPorCuentas = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/account-payable/get-all-pay`, data, { headers: authHeader() });
    dispatch({
      type: GET_ALL_PAYMENT,
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

export const initialState = {
  payables: [],
  abonos: {},
  message: null,
  error: null,
  sendpayables: {},
};

export default function payablesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PAYABLES:
      return {
        ...state,
        payables: action.payload,
      };

    case GET_ALL_PAYMENT:
      return {
        ...state,
        abonos: action.payload,
      };

    case CREATE_PAYABLE:
      return {
        ...state,
        sendpayables: action.payload,
      };

    case CREATE_PAYMENT:
      return {
        ...state,
        payables: action.payload,
      };

    case CREATE_PAYABLE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isSuccess: false,
        payables: null,
      };

    default:
      return state;
  }
}
