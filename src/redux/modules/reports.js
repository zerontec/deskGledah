
import axios from 'axios'
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"

const FETCH_REPORT_REQUEST = 'FETCH_REPORT_REQUEST'
const FETCH_REPORT_SUCCESS ='FETCH_REPORT_SUCCESS'
const FETCH_REPORT_FAILURE = 'FETCH_REPORT_FAILURE'
const CREATE_REPORT = 'CREATE_REPORT'
const GET_ALL_REPORTS = 'GET_ALL_REPORTS'
const UPDATE_REPORT ='UPDATE_REPORT'
const DELETE_REPORT ='DELETE_REPORT'

const DELETE_REPORTS='DELETE_REPORTS,'
const CREATE_REPORTS='CREATE_REPORTS'

export const fetchReportRequest = () => ({
    type: FETCH_REPORT_REQUEST,
  });
  
  export const fetchReportSuccess = (reports) => ({
    type: FETCH_REPORT_SUCCESS,
    payload: reports,
  });
  
  export const fetchReportFailure = (error) => ({
    type: FETCH_REPORT_FAILURE,
    payload: error,
  });
  

  
  export const fetchReports= () => async (dispatch) => {
    dispatch(fetchReportRequest());
    try {
      const response = await fetch(`${API_URL_D}api/report/daily-sales`,{ headers: authHeader() });
      const data = await response.json();
      dispatch(fetchReportSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchReportFailure(error.message));
      return null; // O devuelve otro valor adecuado en caso de error
    }
  };
  
 

 
    
//    export const getDailySales=()=> async()=>{

// try{




// }catch(error){


// }


//    }
    
    
    
    
    
    
    

  export const getAllClosure =() =>async (dispatch)=>{
    
     try {
        const resp = await axios.get(`${API_URL_D}api/dayli/get-all `,{ headers: authHeader() });
  
        dispatch({
          type: GET_ALL_REPORTS,
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
          type: UPDATE_REPORT,
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
          type: DELETE_REPORT,
          payload: { id },
        });
        return({message:"Eliminado con exito"})
      } catch (err) {
        return err.response;
      }
    };





  export const initialState = {
    reports: [],
    message: null,
    error: null,
   sendProducts:{}
    
  };

  export default function reportReducer(state = initialState, action) {
    switch (action.type) {


      case GET_ALL_REPORTS:
        return {
          ...state,
          reports: action.payload,
        };
  

  
        case FETCH_REPORT_REQUEST:
          return{
            ...state,
          isLoading: true,
          error: null
      
          }

          case FETCH_REPORT_SUCCESS:
            return{

                ...state,
                isLoading: false,
                reports:action.payload


            }
            case FETCH_REPORT_FAILURE:
                return {
                  ...state,
                  isLoading: false,
                  error: action.payload
                };


  
      default:
        return state;
    }
  }
  

