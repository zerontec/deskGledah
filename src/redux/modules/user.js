


import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"


const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

const CREATE_USER = 'CREATE_USER';
const GET_USERS = 'GET_USERS';
const CREATE_USER_SUCCESS ='CREATE_USER_SUCCESS';
const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
const UPDATE_USER = 'UPDATE_USER'
const DELETE_USER ='DELETE_USER'
const DELETE_USERS ='DELETE_USERS'

export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = (usuarios) => ({
  type: FETCH_USER_SUCCESS,
  payload: usuarios,
});

export const fetchUserFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

export const fetchUsers= (queryPu) => async(dispatch) => {
 
    dispatch(fetchUserRequest());
    try {
      const response = await fetch(`${API_URL_D}api/users/search-query?q=${queryPu}`);
      const data = await response.json();
      dispatch(fetchUserSuccess(data));
      return data
    } catch (error) {
      dispatch(fetchUserRequest(error.message));
      throw error 
    }
  };


  export const serachUsereById =({id}) => async(dispatch)=>{

    dispatch(fetchUserRequest());
    try {
      const response = await fetch(`${API_URL_D}api/user/search/${id}`,{ headers: authHeader() }
      );
      const data = await response.json();
      dispatch(fetchUserSuccess(data));
      return response.data;
    } catch (error) {
      dispatch(fetchUserFailure(error.message));
      return null
    }
  };



export const getAllUsers= () => async(dispatch) =>  {


    try {
      const resp = await axios.get(`${API_URL_D}api/user/get-all`,{ headers: authHeader() });

      dispatch({
        type: GET_USERS,
        payload: resp.data,
      });
      return resp.data
    } catch (err) {
      return err.response;
    }
  };


export const createUser = (userData) => async (dispatch) => {
    try {
      const { data } = await axios.post(
        `${API_URL_D}api/user/create`,userData,{ headers: authHeader() }
      );
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: data,
      });

      return data;
      // Aquí podrías enviar una notificación de éxito al usuario
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error("El usuario o email  ya existe. Ingrese otro.");
      }
      throw error;
    }
  };
 


  export const updateUser = (id, data) => async (dispatch) => {
    try {
      const resp = await axios.put(`${API_URL_D}api/user/update/${id}`, data,{ headers: authHeader() });
  
      dispatch({
        type: UPDATE_USER,
        payload: resp.data,
      });
  
      return resp.data;
    } catch (err) {
      return err.response;
    }
  };


  export const deleteUser = (id) => async (dispatch) => {
    try {
      await axios.delete(`${API_URL_D}api/user/delete/${id}`,{ headers: authHeader() });
  
      dispatch({
        type: DELETE_USER,
        payload: { id },
      });
      return({message:"Eliminado con exito"})
    } catch (err) {
      return err.response;
    }
  };

  export const deleteMultiplyUser = (ids) => async (dispatch) => {
    try {
      await axios.delete(`${API_URL_D}api/user/delete-multiply`, { data:ids, headers: authHeader() });
  
      dispatch({
        type: DELETE_USERS,
        payload: { ids },
      });
      return({message:"usuarios Eliminados con exito"})
    } catch (err) {
      return err.response;
    }
  };





export const initialState = {
  usuarios: [],
  message: null,
  error: null,
  sendUsuarios:{},
  
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    


    case FETCH_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
          error: null
      };


    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
          usuarios: action.payload
      };


    case FETCH_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
          error: action.payload
      };
    case GET_USERS:
      return {
        ...state,
        usuarios: action.payload,
      };

      case CREATE_USER:
        return{
          ...state,
          customer:action.payload
    
        }



        case UPDATE_USER:
        return{
        ...state,
        usuarios:action.payload


        }
case DELETE_USER:
  return{

    ...state
  }

  case DELETE_USERS:
  return{

    ...state
  }



        case CREATE_USER_ERROR:
  return {
    ...state,
    isLoading: false,
    error: action.payload,
    isSuccess: false,
    usuarios: null,
  };



    default:
      return state;
  }
}
