

import axios from 'axios';
import authHeader from '../services/auth-header';


const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_PURCHASE_REQUEST = 'FETCH_PURCHASE_REQUEST';
const FETCH_PURCHASE_SUCCESS = 'FETCH_PURCHASE_SUCCESS';
const FETCH_PURCHASE_FAILURE = 'FETCH_PURCHASE_FAILURE';

const CREATE_PURCHASE = 'CREATE_PURCHASE';
const GET_PURCHASES = 'GET_PURCHASES';
const CREATE_PURCHASE_SUCCESS ='CREATE_PURCHASE_SUCCESS';
const CREATE_PURCHASE_ERROR = 'CREATE_PURCHASE_ERROR';
const DELETE_PURCHASE = 'DELETE_PURCHASE'
const UPDATE_PURCHASE = 'UPDATE_PURCHASE'


export const fetchPurchaseRequest = () => ({
  type: FETCH_PURCHASE_REQUEST,
});

export const fetchPurchaseSuccess = (customers) => ({
  type: FETCH_PURCHASE_SUCCESS,
  payload: customers,
});

export const fetchPurchaseFailure = (error) => ({
  type: FETCH_PURCHASE_FAILURE,
  payload: error,
});

export const fetchPurchases = (queryPu) => async(dispatch) => {
 
    dispatch(fetchPurchaseRequest());
    try {
      const response = await fetch(`${API_URL_D}api/purchase/search-query-p?q=${queryPu}`,{ headers: authHeader() });
      const data = await response.json();
      dispatch(fetchPurchaseSuccess(data));
      return data
    } catch (error) {
      dispatch(fetchPurchaseRequest(error.message));
      throw error 
    }
  };


export const getAllPurchases= () => async(dispatch) =>  {


    try {
      const resp = await axios.get(`${API_URL_D}api/purchase/all-purchase`,{ headers: authHeader() });

      dispatch({
        type: GET_PURCHASES,
        payload: resp.data,
      });
      return resp.data
    } catch (err) {
      return err.response;
    }
  };


export const createPurchase = (purchaseData) => async (dispatch) => {
    try {
      const response   = await axios.post(
        `${API_URL_D}api/purchase/create-purchase`,
        purchaseData,{ headers: authHeader() }
      );
      dispatch({
        type: CREATE_PURCHASE_SUCCESS,
        payload: response.data,
      });
      return response.data;
      // Aquí podrías enviar una notificación de éxito al usuario
    } catch (error) {
     if(error.response && error.response.status === 409 ){
      throw new Error("El numero de Factura o Compra ya existen ."); 

     }
     throw error;
      // Aquí podrías enviar una notificación de error al usuario
    }
  };
  
  export const deletePurchase = (id) => async (dispatch) => {
    try {
      await axios.delete(`${API_URL_D}api/purchase/delete-purchase/${id}`,{ headers: authHeader() });
  
      dispatch({
        type: DELETE_PURCHASE,
        payload: { id },
      });
      return({message:"Eliminado con exito"})
    } catch (err) {
      return err.response;
    }
  };


  export const updatePurchase = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/purchase/update/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_PURCHASE,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };





export const initialState = {
  purchases: [],
  message: null,
  error: null,
  sendPurchase:{},
  
};

export default function purchaseReducer(state = initialState, action) {
  switch (action.type) {
    
    case GET_PURCHASES:
      return {
        ...state,
        purchases: action.payload,
      };

      case CREATE_PURCHASE:
        return{
          ...state,
          sendPurchase:action.payload
    
        }

        case CREATE_PURCHASE_ERROR:
  return {
    ...state,
    isLoading: false,
    error: action.payload,
    isSuccess: false,
    invoice: null,
  };

  case UPDATE_PURCHASE:
    return{
    ...state,
    purchases:action.payload


    }


  case DELETE_PURCHASE:
    return{
  
      ...state
    }
  

    default:
      return state;
  }
}
