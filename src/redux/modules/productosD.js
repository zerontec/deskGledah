import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';

const FETCH_PRODUCTD_REQUEST = 'FETCH_PRODUCT_REQUEST';
const FETCH_PRODUCTD_SUCCESS = 'FETCH_PRODUCTD_SUCCESS';
const FETCH_PRODUCTD_FAILURE = 'FETCH_PRODUCTD_FAILURE';
const CREATE_PRODUCTD = 'CREATE_PRODUCTD';
const GET_ALL_PRODUCTDS = 'GET_ALL_PRODUCTDS';
const UPDATE_PRODUCTD = 'UPDATE_PRODUCTD';
const DELETE_PRODUCTD = 'DELETE_PRODUCTD';
const MOVE_INVENTORY = 'MOVE_INVENTORY';
const DELETE_PRODUCTDS = 'DELETE_PRODUCTDS,';

export const fetchProductDRequest = () => ({
  type: FETCH_PRODUCTD_REQUEST,
});

export const fetchProductDSuccess = (products) => ({
  type: FETCH_PRODUCTD_SUCCESS,
  payload: products,
});

export const fetchProductDFailure = (error) => ({
  type: FETCH_PRODUCTD_FAILURE,
  payload: error,
});

export const fetchProductsD = (query) => async (dispatch) => {
  dispatch(fetchProductDRequest());
  try {
    const response = await fetch(`${API_URL_D}api/product/search-query?q=${query}`,{ headers: authHeader() });
    const data = await response.json();
    dispatch(fetchProductDSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchProductDFailure(error.message));
    return null; // O devuelve otro valor adecuado en caso de error
  }
};

export const createProductsD = (formInfo) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/productos-defectuosos/create`, formInfo,{ headers: authHeader() });
    dispatch({
      type: CREATE_PRODUCTD,
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

export const getAllProductD = () => async (dispatch) => {
  try {
    const resp = await axios.get(`${API_URL_D}api/productos-defectuosos/all `,{ headers: authHeader() });

    dispatch({
      type: GET_ALL_PRODUCTDS,
      payload: resp.data,
    });
    return resp.data;
  } catch (err) {
    return err.response;
  }
};

export const updateProductD = (id, data) => async (dispatch) => {
  try {
    const resp = await axios.put(`${API_URL_D}api/productos-defectuosos/update/${id}`, data,{ headers: authHeader() });

    dispatch({
      type: UPDATE_PRODUCTD,
      payload: resp.data,
    });

    return resp.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteProductD = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/productos-defectuosos/delete/${id}`,{ headers: authHeader() });

    dispatch({
      type: DELETE_PRODUCTD,
      payload: { id },
    });
    return { message: 'Eliminado con exito' };
  } catch (err) {
    return err.response;
  }
};

export const deleteMultiplyProductsD = (ids) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/productos-defectuosos/delete-multiply`, { data: ids, headers: authHeader() });

    dispatch({
      type: DELETE_PRODUCTDS,
      payload: { ids },
    });
    return { message: 'Productos Eliminados con exito' };
  } catch (err) {
    return err.response;
  }
};

export const initialState = {
  productds: [],
  message: null,
  error: null,
  sendProductsd: {},
};

export default function productdReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTDS:
      return {
        ...state,
        productds: action.payload,
      };

    case CREATE_PRODUCTD:
      return {
        ...state,
        productds: action.payload,
      };

    case FETCH_PRODUCTD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_PRODUCTD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productds: action.payload,
      };
    case FETCH_PRODUCTD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case DELETE_PRODUCTD:
      return {
        ...state,
      };

    case MOVE_INVENTORY:
      return {
        ...state,

        sendProductds: action.payload,
      };
    case UPDATE_PRODUCTD:
      return {
        ...state,
        productds: action.payload,
      };

    default:
      return state;
  }
}
