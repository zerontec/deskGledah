/* eslint-disable default-case */

import axios from 'axios';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_DOLAR_FAILURE = 'FETCH_DOLAR_FAILURE'
const FETCH_DOLAR_SUCCESS = 'FETCH_DOLAR_SUCCESS'
const FETCH_DOLAR_REQUEST = 'FETCH_DOLAR_REQUEST'



export const fetchDolarRequest = () => ({
    type: FETCH_DOLAR_REQUEST,
  });
  
  export const fetchDolarSuccess = (dolar) => ({
    type: FETCH_DOLAR_SUCCESS,
    payload: dolar,
  });
  
  export const fetchDolarFailure = (error) => ({
    type: FETCH_DOLAR_FAILURE,
    payload: error,
  });
  

export const fetchDolarValue =()=> async (dispatch) => {
    
    
  
    dispatch(fetchDolarRequest());
    try {
      const response = await fetch(`${API_URL_D}api/consulta/dolar`);
      const data = await response.json();
      dispatch(fetchDolarSuccess(data));
      return response.data;
    //   // Convertir los valores a números utilizando parseFloat
    //   const bcv = data.bcv;
    //   const enparalelovzla =data.enparalelovzla;
    //   // ...

     
    } catch (error) {
        dispatch(fetchDolarFailure(error.message));
        return null
    }
  };


  export const initialState = {

    dolars: {},
    message: null,
    error: null,
    loading:false
  
  
  }
  export default function dolarReducer(state = initialState, action) {

    switch (action.type) {
  
      case FETCH_DOLAR_REQUEST:
        return {
          ...state,
          isLoading: true,
            error: null
        };




        case FETCH_DOLAR_SUCCESS:
            return {
              ...state,
              isLoading: false,
                dolars: action.payload
            };
      
      
          case FETCH_DOLAR_FAILURE:
            return {
              ...state,
              isLoading: false,
                error: action.payload
            };
      
            default:
                return state;
        

    }}