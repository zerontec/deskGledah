/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { Button, TextField, Alert } from '@mui/material';
import { createExpense } from '../../redux/modules/expenses';





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
  
	const formatAmountB = (amount) => numeral(amount).format('0,0.00');

	const [errors, setErrors] = useState({});
  
	const { message } = useSelector((state) => state);
	console.log('mensaje', message);
  
	const [formInfo, setFormInfo] = useState({
	  concepto: '',
	  monto: '',
	  fecha: '',
	});
	const [isFormValid, setIsFormValid] = useState(false);
  
	const validateForm = () => {
	  const { concepto, monto, fecha } = formInfo;
	  setIsFormValid(concepto.trim() !== '' && monto.trim() !== '' && fecha.trim() !== '');
	};
  
	useEffect(() => {
	  validateForm();
	}, [formInfo]);
  
	function validate(formInfo) {
	  const errors = {};
	  formInfo.concepto ? (errors.concepto = '') : (errors.proveedor = 'Ingrese proveedor ');
	  formInfo.monto ? (errors.monto = '') : (errors.montoPagado = 'Ingrese Monto');
	  formInfo.fecha ? (errors.fecha = '') : (errors.fecha = 'Ingrese una Fecha');
  
	  return errors;
	}
  
	const dispatch = useDispatch();
  
	const handleChange = (event) => {
	  const { name, value } = event.target;
	  setFormInfo((prevFormInfo) => ({
		...prevFormInfo,
		[name]: value,
	  }));
	  setErrors(validate({ ...formInfo, [name]: value }));
  
	
	};
  
	const handleSubmit = (event) => {
	  event.preventDefault();
	  const montoPagadoNumber = parseFloat(formInfo.montoPagado); // Convertir a número
	  const data = {
		concepto: formInfo.concepto,
		monto: formInfo.monto,
		fecha: formInfo.fecha,
		
	  };
  
	  setLoading(true);
	  dispatch(createExpense(data))
		.then((response) => {
		  setLoading(false);
		  Swal.fire('Gasto  creado con éxito!', '', 'success');
		  window.location.reload();
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
					label="Monto "
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