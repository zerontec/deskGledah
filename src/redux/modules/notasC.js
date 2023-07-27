import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';

const FETCH_NOTA_REQUEST = 'FETCH_PRODUCT_REQUEST';
const FETCH_NOTA_SUCCESS = 'FETCH_NOTA_SUCCESS';
const FETCH_NOTA_FAILURE = 'FETCH_NOTA_FAILURE';
const CREATE_NOTA = 'CREATE_NOTA';
const GET_ALL_NOTAS = 'GET_ALL_NOTAS';
const UPDATE_NOTA = 'UPDATE_NOTA';
const DELETE_NOTA = 'DELETE_NOTA';






export const fetchNotaRequest = () => ({
  type: FETCH_NOTA_REQUEST,
});

export const fetchNotaSuccess = (products) => ({
  type: FETCH_NOTA_SUCCESS,
  payload: products,
});

export const fetchNotaFailure = (error) => ({
  type: FETCH_NOTA_FAILURE,
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
      type: CREATE_NOTA,
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
      type: GET_ALL_NOTAS,
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
      type: UPDATE_NOTA,
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
      type: DELETE_NOTA,
      payload: { id },
    });
    return { message: 'Eliminado con exito' };
  } catch (err) {
    return err.response;
  }
};



export const initialState = {
  notas: [],
  message: null,
  error: null,
  sendNotas: {},
};

export default function notaReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_NOTAS:
      return {
        ...state,
        notas: action.payload,
      };

    case CREATE_NOTA:
      return {
        ...state,
        notas: action.payload,
      };

    case FETCH_NOTA_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_NOTA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notas: action.payload,
      };
    case FETCH_NOTA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case DELETE_NOTA:
      return {
        ...state,
      };

  
    case UPDATE_NOTA:
      return {
        ...state,
        productds: action.payload,
      };

    default:
      return state;
  }
}
