
import axios from 'axios'
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"

const FETCH_PRODUCT_REQUEST = 'FETCH_PRODUCT_REQUEST'
const FETCH_PRODUCT_SUCCESS ='FETCH_PRODUCT_SUCCESS'
const FETCH_PRODUCT_FAILURE = 'FETCH_PRODUCT_FAILURE'
const CREATE_PRODUCT = 'CREATE_PRODUCT'
const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS'
const UPDATE_PRODUCT ='UPDATE_PRODUCT'
const DELETE_PRODUCT ='DELETE_PRODUCT'
const MOVE_INVENTORY= 'MOVE_INVENTORY'
const DELETE_PRODUCTS='DELETE_PRODUCTS,'
const CREATE_PRODUCTS='CREATE_PRODUCTS'

export const fetchProductRequest = () => ({
    type: FETCH_PRODUCT_REQUEST,
  });
  
  export const fetchProductSuccess = (products) => ({
    type: FETCH_PRODUCT_SUCCESS,
    payload: products,
  });
  
  export const fetchProductFailure = (error) => ({
    type: FETCH_PRODUCT_FAILURE,
    payload: error,
  });
  

  
  export const fetchProducts = (query) => async (dispatch) => {
    dispatch(fetchProductRequest());
    try {
      const response = await fetch(`${API_URL_D}api/product/search-query?q=${query}`,{ headers: authHeader() });
      const data = await response.json();
      dispatch(fetchProductSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchProductFailure(error.message));
      return null; // O devuelve otro valor adecuado en caso de error
    }
  };
  
    export const createProducts = (formInfo) => async (dispatch) => {
      try {
        const response = await axios.post(`${API_URL_D}api/product/create`, formInfo,{ headers: authHeader() });
        dispatch({
          type: CREATE_PRODUCT,
          payload: response.data,
        });
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          throw new Error("El código ya existe. Ingrese otro.");
        }
        throw error;
      }
    };

    export const uploadMasi = (formInfo) => async (dispatch) => {
      try {
        const {data }= await axios.post(`${API_URL_D}api/product/upload`, formInfo,{ headers: authHeader() });
        dispatch({
          type: CREATE_PRODUCTS,
          payload: data,
        });
        return data;
      } catch (error) {
        if (error.response && error.response.status ) {
          throw new Error("No se puedo cargar los porductos.");
        }
        throw error;
      }
    };
   
    
   
    
    
    
    
    
    
    

  export const getAllProduct =() =>async (dispatch)=>{
    
     try {
        const resp = await axios.get(`${API_URL_D}api/product/all `,{ headers: authHeader() });
  
        dispatch({
          type: GET_ALL_PRODUCTS,
          payload: resp.data,
        });
        return resp.data
      } catch (err) {
        return err.response;
      }
    };
  
  


    export const updateProduct = (id, data) => async (dispatch) => {
      try {
        const resp = await axios.put(`${API_URL_D}api/product/update/${id}`, data,{ headers: authHeader() });
    
        dispatch({
          type: UPDATE_PRODUCT,
          payload: resp.data,
        });
    
        return resp.data;
      } catch (err) {
        return err.response;
      }
    };


    export const deleteProduct = (id) => async (dispatch) => {
      try {
        await axios.delete(`${API_URL_D}api/product/delete/${id}`,{ headers: authHeader() });
    
        dispatch({
          type: DELETE_PRODUCT,
          payload: { id },
        });
        return({message:"Eliminado con exito"})
      } catch (err) {
        return err.response;
      }
    };


    export const deleteMultiplyProducts = (ids) => async (dispatch) => {
      try {
        await axios.delete(`${API_URL_D}api/product/delete-multiply`, { data:ids, headers: authHeader() });
    
        dispatch({
          type: DELETE_PRODUCTS,
          payload: { ids },
        });
        return({message:"Productos Eliminados con exito"})
      } catch (err) {
        return err.response;
      }
    };
  


  export const moveInventory = (formInfo) => async(dispatch)=>{

try{
    const {data}= await axios.post(

      `${API_URL_D}api/product/move-to-store`,
      formInfo
    );
    dispatch({
        type:MOVE_INVENTORY,
        payload:data

    });
    return data;

}catch(error){
  return error.response

}



  }

  export const initialState = {
    products: [],
    message: null,
    error: null,
   sendProducts:{}
    
  };

  export default function productReducer(state = initialState, action) {
    switch (action.type) {


      case GET_ALL_PRODUCTS:
        return {
          ...state,
          products: action.payload,
        };
  


      case CREATE_PRODUCT:
        return {
          ...state,
          products: action.payload,
        };
        case CREATE_PRODUCTS:
          return {
            ...state,
            sendProducts: action.payload,
          };
    
  
        case FETCH_PRODUCT_REQUEST:
          return{
            ...state,
          isLoading: true,
          error: null
      
          }

          case FETCH_PRODUCT_SUCCESS:
            return{

                ...state,
                isLoading: false,
                products:action.payload


            }
            case FETCH_PRODUCT_FAILURE:
                return {
                  ...state,
                  isLoading: false,
                  error: action.payload
                };

                case DELETE_PRODUCT:
                  return{
                      ...state

                  };

                  case MOVE_INVENTORY:
                    return{

                      ...state,

            sendProducts: action.payload,  
                    }
                    case UPDATE_PRODUCT:
                      return{
                      ...state,
                      products:action.payload
              
              
                      }
  
      default:
        return state;
    }
  }
  

