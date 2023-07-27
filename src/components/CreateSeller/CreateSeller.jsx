import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Icon as Iconify } from '@iconify/react';
import {io} from 'socket.io-client';
import Swal from "sweetalert2";
import validator from 'validator';
import { Button, TextField, Alert } from '@mui/material';
import { createSellers } from '../../redux/modules/seller';





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


const CreateSeller = () => {


	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
	const [loading, setLoading] = useState(false);
	const [sellerData, setSellerData] = useState({
		  codigo:'',
		  name: '',
		  identification: '',
		  address: '',
		  telf:''
		});
	const [validationErrors, setValidationErrors] = useState({});
	
	const { message } = useSelector((state) => state);


	// useEffect(() => {
	// 	const socket = io('http://localhost:5040'); // Reemplaza la URL con la del servidor de WebSocket
	
	// 	// Escucha el evento 'new_product' del canal
	// 	socket.on('new_product', (data) => {
	// 	  console.log('Se ha creado un nuevo producto:', data);
	// 	  // Realiza las acciones necesarias con la notificación recibida, por ejemplo, actualiza la lista de productos en tiempo real
		
		
	// 	});
	
	// 	// Retorna una función de limpieza para cerrar la conexión al desmontar el componente
	// 	return () => {
	// 	  socket.disconnect();
	// 	};
	//   }, []);


const dispatch = useDispatch();



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSellerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
	const errors = {};
  
		// Validar el campo de nombre
		if (validator.isEmpty(sellerData.codigo)) {
			errors.codigo = 'El codigo del Empleado es requerido.';
		  }
	// Validar el campo de nombre
	if (validator.isEmpty(sellerData.name)) {
	  errors.name = 'El nombre del Empleado es requerido.';
	}
  
	// Validar el campo de RIF
	if (validator.isEmpty(sellerData.identification)) {
	  errors.identification = 'Cedula del Empleado es requerido.';
	}
  
	// Validar el campo de dirección
	if (validator.isEmpty(sellerData.address)) {
	  errors.address = 'La dirección del Empleado es requerida.';
	}
	if (validator.isEmpty(sellerData.telf)) {
		errors.tlf = 'El numero de el proveedor es requerido requerida.';
	  }
	// Retornar los errores encontrados
	return errors;
  };
  



  const handleSubmitSeller = (event) => {
    event.preventDefault();
	const errors = validateForm();
	if (Object.keys(errors).length > 0) {
		// Si hay errores de validación, actualizar el estado de los errores y detener la creación del proveedor
		setValidationErrors(errors);
		return;
	  }
	setLoading(true);


	dispatch(createSellers(sellerData))
   .then((response)=>{
	setLoading(false);
	Swal.fire("Empleado creado con éxito!", "", "success");
	setSellerData({
		
		codigo:'',
		name: '',
		identification: '',
		address: '',
		telf: ''
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


  function capitalizeFirstLetter(text) {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
  }



	return (


		<>
		
	<hr/>
		  {/* <Button variant="contained" onClick={() => setSelectButton()}>
		Agregar Empleado
		  </Button> */}
		  <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setSelectButton()}>
          Agregar Empleado
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
			<form onSubmit={handleSubmitSeller}>
			  <FormContainer>
				<FieldContainer>
				<TextField
					required
					label="Codigo"
					name="codigo"
					type="text"
					id="codigo"
					value={sellerData.codigo}
					onChange={handleInputChange}
				  />{" "}
			{validationErrors.codigo && <span>{validationErrors.codigo}</span>}


				  <TextField
					required
					label="Nombre"
					name="name"
					type="text"
					id="name"
					value={capitalizeFirstLetter(sellerData.name)}
					onChange={handleInputChange}
				  />{" "}
			{validationErrors.name && <span>{validationErrors.name}</span>}
				  <TextField
					required
					label="Cedula"
					name="identification"
					type="text"
					id="identification"
					value={sellerData.identification}
					onChange={handleInputChange}
				  />{" "}
				  {validationErrors.identification && <span>{validationErrors.identification}</span>}
				  <TextField
					required
					label="Direccion"
					name="address"
					id="address"
					value={capitalizeFirstLetter(sellerData.address)}
					onChange={handleInputChange}
				  />{" "}
				{validationErrors.address && <span>{validationErrors.address}</span>}
				  <TextField
					required
					label="Telefono"
					name="telf"
					id="telf"
					value={sellerData.telf}
					onChange={handleInputChange}
				  />{" "}
				{validationErrors.telf && <span>{validationErrors.telf}</span>}
  
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
					onClick={handleSubmitSeller}
					variant="contained"
					color="primary"
				  >
					{" "}
					{loading ? "Cargando..." : "Agregar Empleado "}{" "}
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

export default CreateSeller;
