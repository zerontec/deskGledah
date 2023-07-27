/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react';

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { deletePurchase, getAllPurchases, updatePurchase } from '../../../redux/modules/purchase';
import { deleteSuppliert, getAllSupplier, updateSupplier } from '../../../redux/modules/supplier';
import { CreateSupplier } from '../../../components/CreateSupplier';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #FF5722;
  border-radius: 20px;
  color: white;
`

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


const columns = [
	{
	  id: "id",
	  label: "Nombre Proveedor",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Direccion",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Rif",
	  minWidth: 50,
	},
	// {
	//   id: "gender",
	//   label: "Precio",
	//   minWidth: 50,
	// },
	{
	  id: "address",
	  label: "Numero telefonico",
	  minWidth: 150,
	},
	// {	
	// 	id:"check",
	// 	label:"Rif",
		

	// },
	// {
	// 	id:"canti",
	// 	label:"cantidad trasladar"
	// }
  ];









const TableSupplier = () => {


	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [errors, setErrors] = useState({});
	const [selectedSupplierId, setSelectedSupplierId] = useState(null);
	const [open, setOpen] = useState(false);
	const [selectedSuppliers, setSelectedSuppliers] = useState([]);
	




	const dispatch = useDispatch()

	useEffect(() => {
		// Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
		dispatch(getAllSupplier());
	  }, [dispatch]);


	  
const proveedores= useSelector((state)=> state.supplier)
console.log(proveedores)




const handleEditClick = (supplier) => {
	setSelectedSupplierId(supplier.id		);
	setSelectedSupplierEdit({
	  name: supplier.name,
	  rif: supplier.rif,
	  address: supplier.address,
	  phoneNumber:supplier.phoneNumber
	 ,
	 
	});
	setOpen(true);
  };
  const [selectedSupplierEdit, setSelectedSupplierEdit] = useState({
	name: "",
	rif: "",
	address:"",
	phoneNumber:""
,
	
  });

  function deleteHandler(items) {
	Swal.fire({
	  title: "Estas Seguro",
	  text: "No podras revertir esta operacion !",
	  icon: "advertencia",
	  showCancelButton: true,
	  confirmButtonColor: "#3085d6",
	  cancelButtonColor: "#d33",
	  confirmButtonText: "Si, Borrar!",
	}).then((result) => {
	  if (result.isConfirmed) {
		dispatch(deleteSuppliert(items.id));
		Swal.fire("El Proveedor ha sido borrado!");

		setTimeout(() => {
		  window.location.reload();
		}, 500);
	  } else {
		Swal.fire("El Proveedor Esta Seguro !");
	  }
	});
  }


  const handleCloseModal = () => {
	setSelectedSupplierId(null);
	setSelectedSupplierEdit({
	  supplierNumber: "",
	  invoiceNumber: "",
	  
	});
	setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
	setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
	setRowsPerPage(parseInt(event.target.value, 10));
	setPage(0);
  };

  


  const handleSubmit = (e) => {
	if (
	  selectedSupplierEdit.name &&
	  selectedSupplierEdit.rif &&
	  selectedSupplierEdit.address&&
	  selectedSupplierEdit.phoneNumber
	
	
	) {
	  e.preventDefault();

	  const data = {
		...selectedSupplierEdit,
		id: selectedSupplierId,
	  };
	  dispatch(updateSupplier(selectedSupplierId, data));
	  Swal.fire(
		"¨Suppliero Editado con Exito  !",
		"You clicked the button!",
		"success"
	  );
	  dispatch(getAllSupplier());
	  
	  handleCloseModal();
	//   getAllAnalysis();
	  
	} else {
	  Swal.fire({
		icon: "error",
		title: "Oops...",
		text: "Debe completar toda la informacion !",
	  });

	  handleCloseModal();
	}
  }; const handleSearch = () => {
	
  };


  function capitalizeFirstLetter(text) {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
  }

	return(

<>
<FormTipo>
 <Typography style={{color:"white",marginLeft:15, marginTop:10}} color="black" variant="h5" sx={{ marginBottom: 2 }}>
        Lista de Proveedores
        </Typography></FormTipo>
	
       
		
	{/* Modal Ver Compra */}
	<Modal
	  open={selectedSupplier !== null}
	  onClose={() => setSelectedSupplier(null)}
	>
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
		{selectedSupplier && (
		  <>
			<h2>{selectedSupplier.name}</h2>
			<p>
			  <strong>Nombre:</strong> {capitalizeFirstLetter(selectedSupplier.name)}
			</p>
			<p>
			  <strong>Rif:</strong> {capitalizeFirstLetter(selectedSupplier.rif)}
			</p>
			<p>
			  <strong>Direccion:</strong> {capitalizeFirstLetter(selectedSupplier.address)}
			</p>
			<p>
			  <strong>Numero de Telefono:</strong> {selectedSupplier.phoneNumber}
			</p>
			
			<Button
			  variant="contained"
			  onClick={() => setSelectedSupplier(null)}
			>
			  Cerrar
			</Button>
		  </>
		)}
	  </Box>
	</Modal>
	{/* End Modal nalysis  */}

	{/* Modal para editar el compra */}
	<Modal open={open} onClose={handleCloseModal}>
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
		
		  <h2>Editar Proveedores</h2>
		  {selectedSupplierEdit && (
			<form
			  onSubmit={(e) => {
				e.preventDefault();
			  }}
			>
			  <FormContainer>
			<FieldContainer>
			  <TextField
				  type="text"
				  value={setSelectedSupplierId.id}
				  onChange={(e) =>
					setSelectedSupplierId({
					  ...selectedSupplierId,
					  id: e.target.value,
					})
				  }
				/>
			 
			 <TextField
				label="Nombre"
			 
				  type="text"
				  value={selectedSupplierEdit.name}
				  onChange={(e) =>
					setSelectedSupplierEdit({
					  ...selectedSupplierEdit,
					  name: e.target.value,
					})
				  }
				/>
			 
			  <br />
			  <TextField
				  label= "Rif"
				  name="rif"
				  value={selectedSupplierEdit.rif}
				  onChange={(e) =>
					setSelectedSupplierEdit({
					  ...selectedSupplierEdit,
					  rif: e.target.value,
					})
				  }
				/>

<TextField
				  label= "Direccion"
				  name="address"
				  value={selectedSupplierEdit.address}
				  onChange={(e) =>
					setSelectedSupplierEdit({
					  ...selectedSupplierEdit,
					  address: e.target.value,
					})
				  }
				/>
				<TextField
				  label= "Numero Telefonico"
				  name="phoneNumber"
				  value={selectedSupplierEdit.phoneNumber}
				  onChange={(e) =>
					setSelectedSupplierEdit({
					  ...selectedSupplierEdit,
					  phoneNumber: e.target.value,
					})
				  }
				/>
			  
			  
{/* 
			  <TextField
			   label= "Precio"
			   name="price"
				  value={selectedPurchaseEdit.price}
				  onChange={(e) =>
					setSelectedPurchaseEdit({
					  ...selectedPurchaseEdit,
					  price: e.target.value,
					})
				  }
				/>
				 */}
			
			 
			 
			  <br />
			  </FieldContainer>
			  <ActionsContainer>
			  <Button
				variant="contained"
				type="submit"
				color="primary"
				onClick={handleSubmit}
				
			  >
				Guardar cambios
			  </Button>
			  </ActionsContainer>
			  </FormContainer>
			</form>
		  )}
		   <hr />
		  <Button variant="contained" onClick={() => setOpen(null)}>
		  Cerrar
		</Button>
	  </Box>
	</Modal>
<CreateSupplier/>


	<Box sx={{ m: 2 }}>
	  <TextField
		label="Buscar Proveedor"
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
	  />
	  <Button variant="contained" onClick={handleSearch}>
		Buscar
	  </Button>
	  <TableContainer component={Paper}>
		<Table sx={{ minWidth: 650 }}>
		  <TableHead>
			<TableRow>
			  {" "}
			  {columns.map((column) => (
				<TableCell
				  key={column.id}
				  align="left"
				  minWidth={column.minWidth}
				>
				  {" "}
				  {column.label}{" "}
				</TableCell>
			  ))}{" "}
			</TableRow>
		  </TableHead>
		  <TableBody>
		  {Array.isArray(proveedores.suppliers) &&
    proveedores.suppliers
      .filter((items) =>
        items.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((items) => (
        <TableRow key={items.id}>
          <TableCell align="left"> {capitalizeFirstLetter(items.name)}</TableCell>
          <TableCell align="left"> {capitalizeFirstLetter(items.address)}</TableCell>
          <TableCell align="left"> {capitalizeFirstLetter(items.rif)}</TableCell>
          <TableCell align="left"> {items.phoneNumber}</TableCell>

					{/* <TableCell align="left" padding="checkbox"    checked={items.selected}
onChange={() => handleToggleSelect(items.id)} >
	  <Checkbox
		
	  />
	</TableCell> */}
	
	{/* <TableCell align="left">
{items.id ? (
<TextField
  type="number"
  value={items.quantityToMove} // Usar el estado quantityToMove del producto
  onChange={(e) =>
	handleQuantityChange(items.id, Number(e.target.value)) // Llamar a una función de manejo de cambios de cantidad
  }
/>
) : null}
</TableCell> */}

{/* <TableCell align="left">
{items.selected ? (
<TextField
  type="number"
  value={"" + items.quantityToMove} // Usar el estado quantityToMove del producto
  onChange={(e) =>
	handleQuantityChange(items.id, Number(e.target.value)) // Llamar a una función de manejo de cambios de cantidad
  }
/>
) : null}
</TableCell> */}
				  <>
					<TableCell className="tableCell">
					  <Button
						variant="contained"
						onClick={() => setSelectedSupplier(items)}
					  >
						Ver
					  </Button>
					</TableCell>
					<TableCell className="tableCell">
					  {/* <Link
						to={`analisis/edit/${analisi.codigo}`}
						style={{ textDecoration: "none" }}
					  >
						<div className="viewButton">Editar</div>
					  </Link> */}
					  <Button
						variant="contained"
						onClick={() => handleEditClick(items)}
					  >
						Editar
					  </Button>
					</TableCell>

					<TableCell className="tableCell">
					
					  <div className="deleteButton"
						id={items.id}
						onClick={() => deleteHandler(items)}>
					  <Button>Borrar</Button>
					  </div>
					</TableCell>

				  </>



				  
				</TableRow>
			  ))}{" "}
		  </TableBody>
		  {/* <Button variant="contained" onClick={handleSubmitPurchase}>
	Enviar
  </Button> */}
		</Table>
		<TablePagination
		  rowsPerPageOptions={[5,10, 100]}
		  component="div"
		  count={proveedores.suppliers.length}
		  rowsPerPage={rowsPerPage}
		  page={page}
		  onPageChange={handleChangePage}
		  onRowsPerPageChange={handleChangeRowsPerPage}
		 />
	  </TableContainer>
	  <hr/>
	</Box>

	<FloatingButtonComponent/>
  </>

	)
};

export const TableSupplierStyle = styled.div``;

export default TableSupplier;
