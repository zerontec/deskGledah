/* eslint-disable no-unused-expressions */

import React, {useState,useEffect} from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from 'react-router-dom';

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { Alert ,Button,	TextField,} from "@mui/material";
import { getAllProduct, createProducts } from '../../../redux/modules/products';
import { ProductTable } from '../ProductTable';





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

const TableContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;


// eslint-disable-next-line arrow-body-style
const Inventory = () => {
	const [errors, setErrors] = useState({});
	const { message } = useSelector((state) => state);
	const [loading, setLoading] = useState(false);
	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
  
	const dispatch = useDispatch();
  
	const [formInfo, setFormInfo] = useState({
	  barcode: "",
	  name: "",
	  description: "",
	  price: "",
	  quantity: "",
	});
	const [isFormValid, setIsFormValid] = useState(false);

	const validateForm = () => {
		const { barcode, name, description, price, quantity } = formInfo;
		setIsFormValid(
		  barcode.trim() !== "" &&
		  name.trim() !== "" &&
		  description.trim() !== "" &&
		  price.trim() !== "" &&
		  quantity.trim() !== ""
		);
	  };


	  useEffect(() => {
		validateForm();
	  }, [formInfo]);

  
	function validate(formInfo) {
	
	  const errors = {};
	  formInfo.barcode
		? (errors.barcode = "")
		: (errors.barcode = "Ingrese un barcode");
	  formInfo.name
		? (errors.name = "")
		: (errors.name = "Ingrese Nombre de Producto");
	  formInfo.description
		? (errors.description = "")
		: (errors.description = "Ingrese una Descripcion");
  
	  formInfo.price
		? (errors.price = "")
		: (errors.price = "Ingrese un Precio");
  
	  formInfo.quantity
		? (errors.quantity = "")
		: (errors.quantity = "Ingrese una cantidad");
  
	  return errors;
	}

function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
	  dispatch(createProducts(formInfo))
		.then((response) => {
		  setLoading(false);
		  Swal.fire("Producto creado con éxito!", "", "success");
		  window.location.reload();
		  setFormInfo({
			barcode: "",
			name: "",
			description: "",
			price: "",
			quantity: "",
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
		  Swal.fire(error.message);
		});
	};
  

	const navigate = useNavigate();

	const handleLinkClick = (link) => {
	  navigate(link);
	  console.log(`Redireccionando a ${link}`);
	};
	return (
	  <>
		<hr />
		<Box sx={{ m: 8 }}>
		  <Button variant="contained" onClick={() => setSelectButton()}>
			Crear Producto
		  </Button>

		<Button  onClick={() => handleLinkClick ('/dashboard/productos-defectuosos')}>
			Productos Defectuosos
		  </Button>

		  <Button  onClick={() => handleLinkClick ('/dashboard/cargar-productos')}>
			Carga Rapida de Productos
		  </Button>

		</Box>

		
  
		<ProductTable />
  
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
					label="Barcode"
					name="barcode"
					type="text"
					id="barcode"
					value={formInfo.barcode}
					onChange={handleChange}
				  />{" "}
				  {errors.barcode && (
					<span className="error-message"> {errors.barcode}</span>
				  )}
				  <TextField
					required
					label="Name"
					name="name"
					type="text"
					id="name"
					value={formInfo.name}
					onChange={handleChange}
				  />{" "}
				  {errors.name && (
					<span className="error-message"> {errors.name}</span>
				  )}
				  <TextField
					required
					label="Description"
					name="description"
					id="description"
					value={formInfo.description}
					onChange={handleChange}
				  />{" "}
				  {errors.description && (
					<span className="error-message"> {errors.description}</span>
				  )}
				  <TextField
					required
					label="Precio"
					name="price"
					id="price"
					value={formInfo.price}
					onChange={handleChange}
				  />{" "}
				  {errors.price && (
					<span className="error-message"> {errors.price}</span>
				  )}
  
				  <TextField
					required
					label="Cantidad"
					name="quantity"
					id="quantity"
					value={formInfo.quantity}
					onChange={handleChange}
				  />{" "}
				  {errors.quantity && (
					<span className="error-message"> {errors.quantity}</span>
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
  disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
>
  {loading ? "Cargando..." : "Crear Producto"}
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
  

export const InventoryStyle = styled.div``;

export default Inventory;
