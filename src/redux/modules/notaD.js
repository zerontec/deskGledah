import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';

const FETCH_NOTAD_REQUEST = 'FETCH_PRODUCT_REQUEST';
const FETCH_NOTAD_SUCCESS = 'FETCH_NOTAD_SUCCESS';
const FETCH_NOTAD_FAILURE = 'FETCH_NOTAD_FAILURE';
const CREATE_NOTAD = 'CREATE_NOTAD';
const GET_ALL_NOTASD = 'GET_ALL_NOTASD';
const UPDATE_NOTAD = 'UPDATE_NOTAD';
const DELETE_NOTAD = 'DELETE_NOTAD';






export const fetchNotaRequest = () => ({
  type: FETCH_NOTAD_REQUEST,
});

export const fetchNotaSuccess = (products) => ({
  type: FETCH_NOTAD_SUCCESS,
  payload: products,
});

export const fetchNotaFailure = (error) => ({
  type: FETCH_NOTAD_FAILURE,
  payload: error,
});




export const fetchNotas = (query) => async (dispatch) => {
  dispatch(fetchNotaRequest());
  try {
    const response = await fetch(`${API_URL_D}api/product/search-query?q=${query}`);
    const data = await response.json();
    dispatch(fetchNotaSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchNotaFailure(error.message));
    return null; // O devuelve otro valor adecuado en caso de error
  }
};

export const createNota = (formInfo) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/api/creditnotes/create`, formInfo);
    dispatch({
      type: CREATE_NOTAD,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error('El código ya existe. Ingrese otro.');
    }
    throw error;
  }
};

export const getAllNotas = () => async (dispatch) => {
  try {
    const resp = await axios.get(`${API_URL_D}api/creditnotes/all-notes `);

    dispatch({
      type: GET_ALL_NOTASD,
      payload: resp.data,
    });
    return resp.data;
  } catch (err) {
    return err.response;
  }
};

export const updateNota = (id, data) => async (dispatch) => {
  try {
    const resp = await axios.put(`${API_URL_D}api/api/creditnotes/update/${id}`, data);

    dispatch({
      type: UPDATE_NOTAD,
      payload: resp.data,
    });

    return resp.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteNota = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/api/creditnotes/delete/${id}`);

    dispatch({
      type: DELETE_NOTAD,
      payload: { id },
    });
    return { message: 'Eliminado con exito' };
  } catch (err) {
    return err.response;
  }
};



export const initialState = {
  notasd: [],
  message: null,
  error: null,
  sendNotas: {},
};

export default function notaDReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_NOTASD:
      return {
        ...state,
        notasd: action.payload,
      };

    case CREATE_NOTAD:
      return {
        ...state,
        notasd: action.payload,
      };

    case FETCH_NOTAD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_NOTAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notasd: action.payload,
      };
    case FETCH_NOTAD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case DELETE_NOTAD:
      return {
        ...state,
      };

  
    case UPDATE_NOTAD:
      return {
        ...state,
        productds: action.payload,
      };

    default:
      return state;
  }
}
