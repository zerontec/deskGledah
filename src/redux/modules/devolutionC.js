import axios from 'axios';
import authHeader from '../services/auth-header';



const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_DEVOLUTIONSC_FAILURE = 'FETCH_DEVOLUTIONSC_FAILURE'
const FETCH_DEVOLUTIONSC_SUCCESS = 'FETCH_DEVOLUTIONSC_SUCCESS'
const FETCH_DEVOLUTIONSC_REQUEST = 'FETCH_DEVOLUTIONSC_REQUEST'
const CREATE_DEVOLUTIONSC= 'CREATE_DEVOLUTIONSC'
const CREATE_DEVOLUTIONC_ERROR = 'CREATE_DEVOLUTIONC_ERROR'
const DEVOLUTIONC_ERROR = 'DEVOLUTIONC_ERROR'
const GET_DEVOLUTIONC ='GET_DEVOLUTIONC'
const UPDATE_DEVOLUTIONC='UPDATE_DEVOLUTIONC'
const DELETE_DEVOLUTIONC= 'DELETE_DEVOLUTIONC'

export const fetchDevolutionRequest = () => ({
  type: FETCH_DEVOLUTIONSC_SUCCESS,
 
});

export const fetchDevolutionSuccess = (devolution) => ({
    type: FETCH_DEVOLUTIONSC_SUCCESS,
    payload: devolution,
  });
  
export const fetchDevolutionFailure = (error) => ({
  type: FETCH_DEVOLUTIONSC_FAILURE,
  payload: error,
});


export const devolutionError = (error) => ({
  type: DEVOLUTIONC_ERROR,
  payload: error,
  
});




export const fetchDevolution = (query) =>async (dispatch) => {
 
  
    dispatch(fetchDevolutionRequest());
    try {
      const response = await fetch(`${API_URL_D}api/customer/search-query?q=${query}`,{ headers: authHeader() }
      );
      const data = await response.json();
      dispatch(fetchDevolutionSuccess(data));
      return response.data;
    } catch (error) {
      dispatch(fetchDevolutionFailure(error.message));
      return null
    }
  };

export const createDevolution = (formInfo) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL_D}api/devolucion-compra/devolution`,
      formInfo,{ headers: authHeader() }
    );
    dispatch({
      type: CREATE_DEVOLUTIONSC,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error({
        message: "El Producto no existe en la factura."
      });
    }
    throw error;
  }
};

 
  

export const getAllDevolution= () => async(dispatch) =>  {


  try {
    const resp = await axios.get(`${API_URL_D}api/devolucion-compra/all-devolucion`,{ headers: authHeader() });

    dispatch({
      type: GET_DEVOLUTIONC,
      payload: resp.data,
    });
    return resp.data
  } catch (err) {
    return err.response;
  }
};



  
export const updateDevolution = (id, data) => async (dispatch) => {
  try {
    const resp = await axios.put(`${API_URL_D}api/devolucion/update/${id}`, data,{ headers: authHeader() });

    dispatch({
      type: UPDATE_DEVOLUTIONC,
      payload: resp.data,
    });

    return resp.data;
  } catch (err) {
    return err.response;
  }
};


export const deleteDevolution = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/customer/delete/${id}`,{ headers: authHeader() });

    dispatch({
      type: DELETE_DEVOLUTIONC,
      payload: { id },
    });
    return({message:"Eliminado con exito"})
  } catch (err) {
    return err.response;
  }
};




export const initialState = {

  devolutionsc: [],
  message: null,
  error: null,
  loading:false


}

export default function devolutionCReducer(state = initialState, action) {

  switch (action.type) {

    case FETCH_DEVOLUTIONSC_REQUEST:
      return {
        ...state,
        isLoading: true,
          error: null
      };


    case FETCH_DEVOLUTIONSC_SUCCESS:
      return {
        ...state,
        isLoading: false,
          devolutionsc: action.payload
      };


    case FETCH_DEVOLUTIONSC_FAILURE:
      return {
        ...state,
        isLoading: false,
          error: action.payload
      };


    case CREATE_DEVOLUTIONSC:
      return {

        ...state,
        devolutionsc: action.payload,
          error: null,

      }


      case CREATE_DEVOLUTIONC_ERROR:
        return {
          ...state,
          devolutionsc: null,
            error: action.payload.msg,
        };


        case UPDATE_DEVOLUTIONC:
          return{
          ...state,
          devolutionsc:action.payload
  
  
          }

          case GET_DEVOLUTIONC:

          return{
  
            ...state
            ,devolutionsc:action.payload
  
          }
  
  case DELETE_DEVOLUTIONC:
    return{
  
      ...state
    }
  

      default:
        return state;


  }





}
