/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { Button, TextField, Alert } from '@mui/material';
import { createExpense, getAllExpense } from '../../redux/modules/expenses';
import { getWeeklyExpenses } from '../../redux/modules/ExpenseWeek';





const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  & > * {
    margin-bottom: 8px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;






const CreateExpenses = () => {
	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
	const [loading, setLoading] = useState(false);
	const [cuentaData, setCuentaData] = useState({
	  proveedor: '',
	  montoPagado: '',
	  fechaPago: '',
	});
	const [valoresDolar, setValoresDolar] = useState({});




	const formatAmountB = (amount) => numeral(amount).format('0,0.00');

	const [errors, setErrors] = useState({});
  
	const { message } = useSelector((state) => state);
	console.log('mensaje', message);
  
	const [formInfo, setFormInfo] = useState({
		concepto: '', // Inicializar como una cadena vacía en lugar de undefined
		monto: '', // Inicializar como una cadena vacía en lugar de undefined
		// fecha: '', // Inicializar como una cadena vacía en lugar de undefined
		// montoDolar: 0,
	  });
	  
	const [isFormValid, setIsFormValid] = useState(false);
  
	// const validateForm = () => {
	//   const { concepto, monto, } = formInfo;
	//   setIsFormValid(concepto.trim() !== '' && monto.trim() !== '' );
	// };
  
	const validateForm = () => {
		const { concepto, monto } = formInfo;
		setIsFormValid(concepto !== '' && monto !== ''); // Verificar si los campos tienen contenido
	  };
	
	useEffect(() => {
	  validateForm();
	}, [formInfo]);
  
	function validate(formInfo) {
		const errors = {};
		if (!formInfo.concepto.trim()) errors.concepto = 'Ingrese concepto';
		if (!formInfo.monto.trim()) errors.monto = 'Ingrese monto';
		// if (!formInfo.fecha.trim()) errors.fecha = 'Ingrese una fecha';
	  
		return errors;
	  }
  
	const dispatch = useDispatch();
  
const handleChange = (event) => {
  const { name, value } = event.target;
  setFormInfo((prevFormInfo) => ({
    ...prevFormInfo,
    [name]: value,
  }));
};
	const fetchDolarValue = async () => {
		try {
		  const response = await fetch('https://expressjs-postgres-production-bd69.up.railway.app/api/consulta/dolar');
		  const data = await response.json();
	
		  // Convertir los valores a números utilizando parseFloat
		  const bcv = data.bcv;
		  const enparalelovzla = data.enparalelovzla;
		  // ...
	
		  setValoresDolar({
			bcv,
			enparalelovzla,
			// ...
		  });
		} catch (error) {
		  console.error('Error al obtener los datos del dólar:', error);
		}
	  };

	  useEffect(() => {
		// Realiza la consulta inicial al cargar el componente
		fetchDolarValue();
	
		// Configura un intervalo para realizar consultas periódicas cada cierto tiempo
		const interval = setInterval(fetchDolarValue, 12 * 60 * 60 * 1000); // Consulta cada 12 horas
	
		// Limpia el intervalo cuando el componente se desmonta
		return () => {
		  clearInterval(interval);
		};
	  }, []);
	


	  const [numericValue, setNumericValue] = useState(0);
	  const [nformattedValue, setNformattedValue] = useState('');
	
	  useEffect(() => {
		if (valoresDolar && valoresDolar.bcv) {
		  const value = valoresDolar.bcv;
		  const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
		  const formattedValue = numericValue.toLocaleString(undefined, { minimumFractionDigits: 3 });
	
		  setNumericValue(numericValue);
		  setNformattedValue(formattedValue);
		} else {
		  console.log('El valor de bcv no está definido');
		}
	  }, [valoresDolar]);
  
console.log("bcv", nformattedValue)
console.log("monto", formInfo.monto)
const montoPagadoNumber = parseFloat(formInfo.monto); // Convertir a número
console.log("montoPagado", montoPagadoNumber)	  
const toNumNForm= parseFloat(nformattedValue) 
const gastoDolar = montoPagadoNumber / toNumNForm
console.log("gasto Dolar", gastoDolar)


useEffect(()=>{

	dispatch(getAllExpense())


}, [dispatch])


	const handleSubmit = (event) => {
	  event.preventDefault();
	  const montoPagadoNumber = parseFloat(formInfo.monto); // Convertir a número
	  
	  const data = {
		concepto: formInfo.concepto,
		monto: formInfo.monto,
		fecha: formInfo.fecha,
		montoDolar:gastoDolar
		
	  };
  
	  const errors = validate(formInfo);
	  setErrors(errors);
	  if (Object.keys(errors).length === 0) {
		setLoading(true);
		dispatch(createExpense(data))
		  .then((response) => {
			setLoading(false);
			Swal.fire('Gasto creado con éxito!', '', 'success');
			// window.location.reload();
			dispatch(getAllExpense())
			dispatch(getWeeklyExpenses())
			setFormInfo({
			  proveedor: '',
			  montoPagado: '',
			  fechaPago: '',
			});
			setSelectButton(null);
			if (response.error) {
			  setMessageError(response.error);
			}
		  })
		  .catch((error) => {
			if (error.response && error.response.status === 400) {
			  const errorMessage = error.response.data.message;
			  Swal.fire({
				icon: 'error',
				title: 'Error',
				text: errorMessage,
			  });
			} else {
			  console.error('Error al generar a intentar agregar abono:', error);
			}
		  });
	  }
	};




	return (
		<>
		
		<Button variant="contained" onClick={() => setSelectButton()}>
		  Crear Gasto 
		</Button>
  
		<Modal open={selectButton !== null} onClose={() => setSelectButton(null)}>
		  <Box
			sx={{
			  position: 'absolute',
			  top: '50%',
			  left: '50%',
			  transform: 'translate(-50%, -50%)',
			  width: 400,
			  bgcolor: 'background.paper',
			  borderRadius: '8px',
			  boxShadow: 24,
			  p: 4,
			}}
		  >
			{/* Aquí va el contenido del modal */}
			<form onSubmit={handleSubmit}>
			  <FormContainer>
				<FieldContainer>
				  {/* <TextField
					required
					label="Compra Id"
					name="compraId"
					type="text"
					id="compraId"
					value={compraId}
					onChange={handleChange}
				  /> */}
				  <TextField
					required
					label="concepto"
					name="concepto"
					type="text"
					id="concepto"
					value={formInfo.concepto}
					onChange={handleChange}
				  />{' '}
				  {errors.concepto && <span className="error-message"> {errors.concepto}</span>}
				  <TextField
					required
					label="Monto Bs"
					name="monto"
					type="number"
					id="monto"
					value={formInfo.monto}
					onChange={handleChange}
				  />{' '}
				  {errors.monto && <span className="error-message"> {errors.monto}</span>}
				  <TextField
					required
					label="Fecha "
					type="date"
					name="fecha"
					id="fecha"
					value={formInfo.fecha}
					onChange={handleChange}
				  />{' '}
				  {errors.fecha && <span className="error-message"> {errors.fecha}</span>}
				  {message && (
					<Alert severity="error" sx={{ mt: 2 }}>
					  {' '}
					  {messageError}{' '}
					</Alert>
				  )}{' '}
				</FieldContainer>
				<ActionsContainer>
				  <Button
					type="submit"
					onClick={handleSubmit}
					variant="contained"
					color="primary"
					disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
				  >
					{loading ? 'Cargando...' : 'Agregar Gasto'}
				  </Button>
				</ActionsContainer>
			  </FormContainer>
			</form>
			<hr />
			<Button variant="contained" onClick={() => setSelectButton(null)}>
			  Cerrar
			</Button>
		  </Box>
		</Modal>
	  </>

	)
};

export const CreateExpensesStl = styled.div``;

CreateExpenses.propTypes = {};

export default CreateExpenses;