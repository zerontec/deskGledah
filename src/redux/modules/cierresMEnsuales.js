/* eslint-disable consistent-return */
import axios from 'axios';
import authHeader from '../services/auth-header';



const API_URL_D = 'http://localhost:5040/';
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"

 const FETCH_INVENTARIO_INICIAL = 'FETCH_INVENTARIO_INICIAL';
 const FETCH_INVENTARIO_FINAL = 'FETCH_INVENTARIO_FINAL';
 const GENERAR_CIERRE_MENSUAL = 'GENERAR_CIERRE_MENSUAL';
const SEARCH_INVENTORY_SUCCESS = 'SEARCH_INVENTORY_SUCCESS'
export const fetchInventarioInicial = () => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/inventory/inventario-inicial`);
    dispatch({ type: FETCH_INVENTARIO_INICIAL,
         payload: response.data });
  
         return response.data
}
  
  catch (error) {
    if(error.response && error.response.status===500 ){

                throw new Error (" Error al crear inventario Inicial ")
    }
    console.error('Error fetching inventario inicial:', error);
  }
};

export const fetchInventarioFinal = () => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL_D}api/inventory/inventario-final`);
    dispatch({ type: FETCH_INVENTARIO_FINAL, payload: response.data });
    return response.data
}
  
  catch (error) {
    if(error.response && error.response.status===500 ){

                throw new Error (" Error al crear inventario Inicial ")
    }
    console.error('Error fetching inventario inicial:', error);
  }
};
export const generarCierreMensual = (fechaInicio, fechaFin) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL_D}api/inventory/cierre-mensual/${fechaInicio}/${fechaFin}`);
    dispatch({ type: GENERAR_CIERRE_MENSUAL, payload: response.data });
    return response.data;
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error("Error al generar Cierre Mensual .");
        }
        throw error;
      }
    };



    export const showInventoryByDate = (fechaInicio, fechaFin) => async (dispatch) => {
        try {
          const response = await axios.get(`${API_URL_D}api/inventory/show-inventory-initial/${fechaInicio}/${fechaFin}`,{ headers: authHeader() });
          dispatch({
            type: SEARCH_INVENTORY_SUCCESS,
            payload: response.data,
          });
          return response.data;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ message: "No existen facturas para ese rango de fechas" });
          }
          throw error;
        }
      };


export const initialState = {

    inventarioI: [],
    inventarioF: [],
    cierres:[],
    message: null,
    error: null,
    loading:false
  
  
  }


export default function cierresReducer(state = initialState, action) {

    switch (action.type) {
        case FETCH_INVENTARIO_INICIAL:
          return {...state,
            inventarioI: action.payload
  
          }
      ;

      case FETCH_INVENTARIO_FINAL:
        return {
            ...state,
            inventarioF: action.payload

        };

        case GENERAR_CIERRE_MENSUAL:
            return {
                ...state,
                cierre: action.payload
    
            };

            case SEARCH_INVENTORY_SUCCESS:
                return{

                    ...state,
                    inventarioI: action.payload

                }

        default:
            return state;
    
    }

}
