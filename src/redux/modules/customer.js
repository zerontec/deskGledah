import axios from 'axios';
import authHeader from '../services/auth-header';



const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMER_FAILURE'
const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS'
const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST'
const CREATE_CUSTOMER = 'CREATE_CUSTOMER'
const CREATE_CUSTOMER_ERROR = 'CREATE_CUSTOMER_ERROR'
const CUSTOMER_ERROR = 'CUSTOMER_ERROR'
const GET_CUSTOMER ='GET_CUSTOMER'
const UPDATE_CUSTOMER='UPDATE_CUSTOMER'
const DELETE_CUSTOMER= 'DELETE_CUSTOMER'

export const fetchCustomersRequest = () => ({
  type: FETCH_CUSTOMERS_REQUEST,
});

export const fetchCustomersSuccess = (customers) => ({
  type: FETCH_CUSTOMERS_SUCCESS,
  payload: customers,
});

export const fetchCustomersFailure = (error) => ({
  type: FETCH_CUSTOMERS_FAILURE,
  payload: error,
});


export const customerError = (error) => ({
  type: CUSTOMER_ERROR,
  payload: error,
  
});




export const fetchCustomers = (query) =>async (dispatch) => {
 
  
    dispatch(fetchCustomersRequest());
    try {
      const response = await fetch(
        `${API_URL_D}api/customer/search-query?q=${query}`,{ headers: authHeader() }
      );
      const data = await response.json();
      dispatch(fetchCustomersSuccess(data));
      return response.data;
    } catch (error) {
      dispatch(fetchCustomersFailure(error.message));
      return null
    }
  };

export const createCustomer = (formInfo) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL_D}api/customer/create`,
      formInfo,{ headers: authHeader() }
    );
    dispatch({
      type: CREATE_CUSTOMER,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error({
        message: "El código ya existe. Ingrese otro."
      });
    }
    throw error;
  }
};

 
  

export const getAllCustomer= () => async(dispatch) =>  {


  try {
    const resp = await axios.get(`${API_URL_D}api/customer/find-all`,{ headers: authHeader() });

    dispatch({
      type: GET_CUSTOMER,
      payload: resp.data,
    });
    return resp.data
  } catch (err) {
    return err.response;
  }
};


export const serachCustomeById =({id}) => async(dispatch)=>{

  dispatch(fetchCustomersRequest());
  try {
    const response = await fetch(`${API_URL_D}api/customer/search/${id}`,{ headers: authHeader() }
    );
    const data = await response.json();
    dispatch(fetchCustomersSuccess(data));
    return response.data;
  } catch (error) {
    dispatch(fetchCustomersFailure(error.message));
    return null
  }
};




  
export const updateCustomer = (id, data) => async (dispatch) => {
  try {
    const resp = await axios.put(`${API_URL_D}api/customer/update/${id}`, data,{ headers: authHeader() });

    dispatch({
      type: UPDATE_CUSTOMER,
      payload: resp.data,
    });

    return resp.data;
  } catch (err) {
    return err.response;
  }
};


export const deleteCustomer = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL_D}api/customer/delete/${id}`,{ headers: authHeader() });

    dispatch({
      type: DELETE_CUSTOMER,
      payload: { id },
    });
    return({message:"Eliminado con exito"})
  } catch (err) {
    return err.response;
  }
};




export const initialState = {

  customers: [],
  message: null,
  error: null,
  loading:false


}

export default function customerReducer(state = initialState, action) {

  switch (action.type) {

    case FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        isLoading: true,
          error: null
      };


    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
          customers: action.payload
      };


    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        isLoading: false,
          error: action.payload
      };


    case CREATE_CUSTOMER:
      return {

        ...state,
        customer: action.payload,
          error: null,

      }


      case CREATE_CUSTOMER_ERROR:
        return {
          ...state,
          customers: null,
            error: action.payload.msg,
        };


        case UPDATE_CUSTOMER:
          return{
          ...state,
          customers:action.payload
  
  
          }

          case GET_CUSTOMER:

          return{
  
            ...state
            ,customers:action.payload
  
          }
  
  case DELETE_CUSTOMER:
    return{
  
      ...state
    }
  

      default:
        return state;


  }





}
