import axios from 'axios';
import authHeader from '../services/auth-header';



const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_DEVOLUTIONS_FAILURE = 'FETCH_DEVOLUTIONS_FAILURE'
const FETCH_DEVOLUTIONS_SUCCESS = 'FETCH_DEVOLUTIONS_SUCCESS'
const FETCH_DEVOLUTIONS_REQUEST = 'FETCH_DEVOLUTIONS_REQUEST'
const CREATE_DEVOLUTIONS= 'CREATE_DEVOLUTIONS'
const CREATE_DEVOLUTION_ERROR = 'CREATE_DEVOLUTION_ERROR'
const DEVOLUTION_ERROR = 'DEVOLUTION_ERROR'
const GET_DEVOLUTION ='GET_DEVOLUTION'
const UPDATE_DEVOLUTION='UPDATE_DEVOLUTION'
const DELETE_DEVOLUTION= 'DELETE_DEVOLUTION'

export const fetchDevolutionRequest = () => ({
  type: FETCH_DEVOLUTIONS_REQUEST,
});

export const fetchDevolutionSuccess = (devolution) => ({
  type: FETCH_DEVOLUTIONS_SUCCESS,
  payload: devolution,
});

export const fetchDevolutionFailure = (error) => ({
  type: FETCH_DEVOLUTIONS_FAILURE,
  payload: error,
});


export const devolutionError = (error) => ({
  type: DEVOLUTION_ERROR,
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
      `${API_URL_D}api/devolucion/create-devolucion`,
      formInfo,{ headers: authHeader() }
    );
    dispatch({
      type: CREATE_DEVOLUTIONS,
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
    const resp = await axios.get(`${API_URL_D}api/devolucion/all-devolucion`,{ headers: authHeader() });

    dispatch({
      type: GET_DEVOLUTION,
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
      type: UPDATE_DEVOLUTION,
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
      type: DELETE_DEVOLUTION,
      payload: { id },
    });
    return({message:"Eliminado con exito"})
  } catch (err) {
    return err.response;
  }
};




export const initialState = {

  devolutions: [],
  message: null,
  error: null,
  loading:false


}

export default function devolutionReducer(state = initialState, action) {

  switch (action.type) {

    case FETCH_DEVOLUTIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
          error: null
      };


    case FETCH_DEVOLUTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
          devolutions: action.payload
      };


    case FETCH_DEVOLUTIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
          error: action.payload
      };


    case CREATE_DEVOLUTIONS:
      return {

        ...state,
        devolutions: action.payload,
          error: null,

      }


      case CREATE_DEVOLUTION_ERROR:
        return {
          ...state,
          devolutions: null,
            error: action.payload.msg,
        };


        case UPDATE_DEVOLUTION:
          return{
          ...state,
          devolutions:action.payload
  
  
          }

          case GET_DEVOLUTION:

          return{
  
            ...state
            ,devolutions:action.payload
  
          }
  
  case DELETE_DEVOLUTION:
    return{
  
      ...state
    }
  

      default:
        return state;


  }





}
