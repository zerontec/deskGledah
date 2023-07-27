import React, {useState} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import validator from 'validator';
import { Button, TextField, Alert } from '@mui/material';
import { createSuppliers } from '../../redux/modules/supplier';





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


const CreateSupplier = () => {


	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
	const [loading, setLoading] = useState(false);
	const [supplierData, setSupplierData] = useState({
		  name: '',
		  rif: '',
		  address: '',
		  phoneNumber:''
		});
	const [validationErrors, setValidationErrors] = useState({});
	
	const { message } = useSelector((state) => state);





const dispatch = useDispatch();



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSupplierData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
	const errors = {};
  
	// Validar el campo de nombre
	if (validator.isEmpty(supplierData.name)) {
	  errors.name = 'El nombre del proveedor es requerido.';
	}
  
	// Validar el campo de RIF
	if (validator.isEmpty(supplierData.rif)) {
	  errors.rif = 'El RIF del proveedor es requerido.';
	}
  
	// Validar el campo de dirección
	if (validator.isEmpty(supplierData.address)) {
	  errors.address = 'La dirección del proveedor es requerida.';
	}
	if (validator.isEmpty(supplierData.phoneNumber)) {
		errors.phoneNumber = 'El numero de el proveedor es requerido requerida.';
	  }
	// Retornar los errores encontrados
	return errors;
  };
  



  const handleSubmitSupplier = (event) => {
    event.preventDefault();
	const errors = validateForm();
	if (Object.keys(errors).length > 0) {
		// Si hay errores de validación, actualizar el estado de los errores y detener la creación del proveedor
		setValidationErrors(errors);
		return;
	  }
	setLoading(true);


	dispatch(createSuppliers(supplierData))
   .then((response)=>{
	setLoading(false);
	Swal.fire("Proveedor creado con éxito!", "", "success");
	setSupplierData({
		name: '',
		rif: '',
		address: '',
		phoneNumber: ''
	  });
	  
	setSelectButton(null);
	if (response.error) {
		setMessageError(response.error);
	  }
	setValidationErrors({});
 
	  
   })
  

   .catch((error) => {
	console.log(error);
	setLoading(false);
	setSelectButton(null);
	setMessageError(error.message);
	Swal.fire(error.message);
  });
    // Limpia el formulario después de la creación exitosa del proveedor
   
	
  };


 



	return (


		<>
		
		<hr />
		<Box sx={{ m: 8 }}>
		  <Button variant="contained" onClick={() => setSelectButton()}>
			Crear Proveedor
		  </Button>
		</Box>
  
	
  
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
			<form onSubmit={handleSubmitSupplier}>
			  <FormContainer>
				<FieldContainer>
				  <TextField
					required
					label="Nombre"
					name="name"
					type="text"
					id="name"
					value={supplierData.name}
					onChange={handleInputChange}
				  />{" "}
			{validationErrors.name && <span>{validationErrors.name}</span>}
				  <TextField
					required
					label="Rif"
					name="rif"
					type="text"
					id="rif"
					value={supplierData.rif}
					onChange={handleInputChange}
				  />{" "}
				  {validationErrors.rif && <span>{validationErrors.rif}</span>}
				  <TextField
					required
					label="Direccion"
					name="address"
					id="address"
					value={supplierData.address}
					onChange={handleInputChange}
				  />{" "}
				{validationErrors.address && <span>{validationErrors.address}</span>}
				  <TextField
					required
					label="Telefono"
					name="phoneNumber"
					id="phoneNumber"
					value={supplierData.phoneNumber}
					onChange={handleInputChange}
				  />{" "}
				{validationErrors.phoneNumber && <span>{validationErrors.phoneNumber}</span>}
  
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
					onClick={handleSubmitSupplier}
					variant="contained"
					color="primary"
				  >
					{" "}
					{loading ? "Cargando..." : "Agregar Proveedor "}{" "}
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

export const CreateSupplierStyle = styled.div``;

export default CreateSupplier;
