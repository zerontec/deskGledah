/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

import { Button, TextField, Alert } from '@mui/material';
import { createLoansClient, getAllLoansClient } from '../../redux/modules/loanClient';

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

const CreateLoanCustomer = () => {
	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
	const [loading, setLoading] = useState(false);
	const [loanData, setLoanData] = useState({
	  
	  amount: '',
	  nota: '',
	 
	});

	

	const [errors, setErrors] = useState({});

	const { message } = useSelector((state) => state);
	console.log('mensaje', message);
  
	const [formInfo, setFormInfo] = useState({
		codigoClinte: "",
		amount: "",
		notes: "",
		phoneNumber: ""
		
	  });
	  const [isFormValid, setIsFormValid] = useState(false);
  
	  const validateForm = () => {
		  const { codigoClinte, amount, notes, phoneNumber } = formInfo;
		  setIsFormValid(
			codigoClinte.trim() !== "" &&
			amount.trim() !== "" &&
			notes.trim() !== "" && 
			phoneNumber.trim() !== ""

			
		  );
		};
		
		useEffect(() => {
			validateForm();
		  }, [formInfo]);
	
		  function validate(formInfo) {
	
			const errors = {};
			formInfo.codigoClinte
			  ? (errors.codigoClinte = "")
			  : (errors.codigoClinte = "Ingrese el codigo de Empleado");
			formInfo.amount
			  ? (errors.amount = "")
			  : (errors.amount = "Ingrese Monto");
			formInfo.notes
			  ? (errors.notes = "")
			  : (errors.notes = "Ingrese una Descripcion");
		
			  formInfo.phoneNumber
			  ? (errors.phoneNumber = "")
			  : (errors.phoneNumber = "Ingrese un Numero Telefonico");
		
		
			return errors;
		  }





  //   const [productList, setProductList] = useState([]);
  
	//   const handleProductChange = (index, event) => {
	//     const { amount, value } = event.target;
	//     const updatedProductList = [...productList];
	//     updatedProductList[index][name] = value;
	//     setProductList(updatedProductList);
	//   };
  
	const handleLoanChange = (index, field, value) => {
	  setLoanData((prevData) => {
		const newLoan = [...prevData.loans];
		newLoan[index][field] = value;
		return { ...prevData, loans: newLoan };
	  });
	};
  

	const dispatch = useDispatch();

	useEffect(()=>{

		dispatch(getAllLoansClient())


	},[dispatch])


  
	const handleInputChange = (event) => {
	  const { name, value } = event.target;
	  setLoanData((prevData) => ({ ...prevData, [name]: value }));
	};

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
		setLoading(true);
		dispatch(createLoansClient(formInfo))
		  .then((response) => {
			setLoading(false);
			Swal.fire("Prestamo creado con éxito!", "", "success");
			dispatch(getAllLoansClient())
			
			setFormInfo({
			  codigoClinte: "",
			  amount: "",
			  notes: "",
			  phoneNumber:''
			 
			});
			setSelectButton(null);
			if (response.error) {
			  setMessageError(response.error);
			}
		  })
		  .catch((error) => {
			console.log(error);
			setLoading(false);
			setSelectButton(null);
			setMessageError(error.message);
			// Swal.fire(error.message);
		  });
	  };
	
	return (
	  <>
	
		<Button variant="contained" onClick={() => setSelectButton()}>
			Crear Prestamo a Clientes
		  </Button>
		  <Modal open={selectButton !== null} onClose={() => setSelectButton(null)}>
		  <Box
			sx={{
			  position: "absolute",
			  top: "50%",
			  left: "50%",
			  transform: "translate(-50%, -50%)",
			  width: 400,
			  bgcolor: "background.paper",
			  borderRadius: "8px",
			  boxShadow: 24,
			  p: 4,
			}}
		  >
			{/* Aquí va el contenido del modal */}
			<form onSubmit={handleSubmit}>
			  <FormContainer>
				<FieldContainer>
				  <TextField
					required
					label="identificacion"
					name="codigoClinte"
					type="text"
					id="codigoClinte"
					value={formInfo.codigoClinte}
					onChange={handleChange}
				  />{" "}
				  {errors.codigoClinte && (
					<span className="error-message"> {errors.codigoClinte}</span>
				  )}
				  <TextField
					required
					label="Cantidad "
					name="amount"
					type="text"
					id="amount"
					value={formInfo.amount}
					onChange={handleChange}
				  />{" "}
				  {errors.amount && (
					<span className="error-message"> {errors.amount}</span>
				  )}
  <TextField
					required
					label="Numero Telfonico "
					name="numberPhone"
					type="text"
					id="numberPhone"
					value={formInfo.numberPhone}
					onChange={handleChange}
				  />{" "}
				  {errors.numberPhone && (
					<span className="error-message"> {errors.numberPhone}</span>
				  )}

				  <TextField
					required
					label="Nota"
					name="notes"
					id="notes"
					value={formInfo.notes}
					onChange={handleChange}
				  />{" "}
				  {errors.notes && (
					<span className="error-message"> {errors.notes}</span>
				  )}
				 
				  {message && (
					<Alert severity="error" sx={{ mt: 2 }}>
					  {" "}
					  {messageError}{" "}
					</Alert>
				  )}{" "}
				</FieldContainer>
				<ActionsContainer>
				<Button
  type="submit"
  onClick={handleSubmit}
  variant="contained"
  color="primary"
//   disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
>
  {loading ? "Cargando..." : "Crear Prestamo"}
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
	);
  };
  


export const CreateLoanStl = styled.div``;



export default CreateLoanCustomer;