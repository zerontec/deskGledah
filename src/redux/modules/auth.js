


import authServices from "../services/auth-services";

 const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
 const REGISTER_FAIL = 'REGISTER_FAIL';
 const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
 const LOGIN_FAIL = 'LOGIN_FAIL';
 const LOGOUT = 'LOGOUT';
 const SET_MESSAGE = 'SET_MESSGE';
 const CLEAR_MESSAGE = 'CLEAR_MESSGE';
 const REGISTER_USER = 'REGISTER_USER';


export const register = (name, username, email, password) => (dispatch) => authServices.register(name, username, email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });
      return Promise.resolve();
    },

    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );

export const login = (username, password) => (dispatch) => authServices.login(username, password).then(
    (data) => { dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
// message
export const setMessage = (message) => ({
    type: SET_MESSAGE,
    payload: message,
  });
  
  export const clearMessage = () => ({
    type: CLEAR_MESSAGE,
  });
  
  

export const logout = () => (dispatch) => {
    authServices.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };
  



  const user = JSON.parse(localStorage.getItem("user"));
  
  export const initialState = {
    user: user
      ? { isLoggedIn: true, ...user }
      : { isLoggedIn: false, user: null },
      message: null, // aquí se inicializa con null
      error: null,
  }

  export default function authReducer(state = initialState, action) {
    switch (action.type) {



        case REGISTER_SUCCESS:
            return {
              ...state,
              isLoggedIn: false,
            };
            case REGISTER_FAIL:
              return {
                ...state,
                isLoggedIn: false,
              };
      
          case REGISTER_USER:
            return {
              ...state,
              register_user: action.payload,
            };
         
          case SET_MESSAGE:
            return {
              message: action.payload,
            };
          case CLEAR_MESSAGE:
            return {
              message: "",
            };
      
          case LOGIN_SUCCESS:
            return {
              ...state,
              isLoggedIn: true,
              user: action.payload.user,
            };
      
          case LOGIN_FAIL:
            return {
              ...state,
              isLoggedIn: false,
              user: null,
            };
      
          case LOGOUT:
            return {
              ...state,
              isLoggedIn: false,
              user: null,
            };


            default:
                return state;
            }



    }


 


