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
import {  Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";

import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { deletePurchase, getAllPurchases, updatePurchase } from '../../../redux/modules/purchase';
import { fDateTime } from '../../../utils/formatTime';
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
	  label: "Numero de Compra",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Numero Factura",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Total Compra",
	  minWidth: 50,
	},
	// {
	//   id: "gender",
	//   label: "Precio",
	//   minWidth: 50,
	// },
	{
	  id: "address",
	  label: "Empresa",
	  minWidth: 150,
	},
	{	
		id:"check",
		label:"Rif",
		

	},
	{	
		id:"check",
		label:"Estatus",
		

	},
	// {
	// 	id:"canti",
	// 	label:"cantidad trasladar"
	// }
  ];









// eslint-disable-next-line arrow-body-style
const TablePurchases = () => {	
	
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(100);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPurchase, setSelectedPurchase] = useState(null);
	const [errors, setErrors] = useState({});
	const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
	const [open, setOpen] = useState(false);
	const [selectedPurchases, setSelectedPurchases] = useState([]);
	
	
	fDateTime()


	const dispatch = useDispatch()

	useEffect(() => {
		// Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
		dispatch(getAllPurchases());
	  }, [dispatch]);


	  
const compras= useSelector((state)=> state.purchase)
console.log(compras)




const handleEditClick = (purchase) => {
	setSelectedPurchaseId(purchase.id		);
	setSelectedPurchaseEdit({
	  supplierName: purchase.supplierName,
	  supplierRif: purchase.supplierRif,
	  invoiceNumber: purchase.invoiceNumber,
	  purchaseNumber:purchase.purchaseNumber
	 ,
	 
	});
	setOpen(true);
  };
  const [selectedPurchaseEdit, setSelectedPurchaseEdit] = useState({
	supplierName: "",
	invoiceRif: "",
	invoiceNumber:"",
	purchaseNumber:""
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
		dispatch(deletePurchase(items.id));
		Swal.fire("La compra ha sido borrado!");
		dispatch(getAllPurchases())
	  } else {
		Swal.fire("La compra  Esta Seguro !");
	  }
	});
  }
  const handleCloseModal = () => {
	setSelectedPurchaseId(null);
	setSelectedPurchaseEdit({
	  purchaseNumber: "",
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
	  selectedPurchaseEdit.supplierName &&
	  selectedPurchaseEdit.supplierRif &&
	  selectedPurchaseEdit.invoiceNumber &&
	  selectedPurchaseEdit.purchaseNumber
	
	
	) {
	  e.preventDefault();

	  const data = {
		...selectedPurchaseEdit,
		id: selectedPurchaseId,
	  };
	  dispatch(updatePurchase(selectedPurchaseId, data));
	  Swal.fire(
		"¨Purchaseo Editado con Exito  !",
		"You clicked the button!",
		"success"
	  );
	  dispatch(getAllPurchases());
	  
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
  };


  function capitalizeFirstLetter(text) {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  const handleSearch = () => {
	
  };


  const generatePDF = () => {
	if (!selectedPurchase) {
	  return;
	}
  
	const {productDetails,supplierAddress,totalAmount,supplierName,supplierRif, invoiceNumber, credit, status, clienteData, vendedorData, productoFactura, totalProductosSinIva, ivaTotal, amount, metodoPago, createdAt } = selectedPurchase;
  
	// Crear un nuevo documento PDF
	// eslint-disable-next-line new-cap
	const doc = new jsPDF();
  
	  // Agregar el membrete al PDF
	  const companyName = 'Galeria Amar, C.A';
	  const companyAddress = 'Av Antonio Paez San Felix ';
	  doc.text(companyName, 20, 10);
	  doc.text(companyAddress, 20, 18);
	
  
	  	// Agregar la fecha de la factura
	doc.setFontSize(12);
	doc.text(`Fecha de Factura: ${fDateTime(createdAt)}`, 20, 28);
  
	// Agregar el número de factura
	doc.setFontSize(12);
	doc.text(`Número de Factura Compra: ${invoiceNumber}`, 20, 35);
	doc.text(`Proveedor: ${supplierName}`, 20, 42);
	doc.text(`Rif: ${supplierRif}`, 20, 49);
	doc.text(`Dirección: ${supplierAddress}`, 20, 55);
  




	// Agregar los datos generales de la factura
	// doc.setFontSize(12);
	// doc.text(`Factura a crédito: ${credit ? 'Sí' : 'No'}`, 20, 40);
	// doc.text(`Estado: ${status}`, 20, 50);
	// doc.text(`Cliente: ${clienteData.name}`, 20, 60);
	// doc.text(`Cédula o Rif: ${clienteData.identification}`, 20, 70);
	// doc.text(`Código Vendedor: ${vendedorData?.codigo}`, 20, 80);
	// doc.text(`Nombre Vendedor: ${vendedorData?.name}`, 20, 90);
  
	// Agregar la lista de productos
	doc.setFontSize(14);
	doc.text('Lista de Productos:', 20, 110);
  
	let y = 120;
	doc.setFontSize(12);
	doc.text('Código', 20, y);
	doc.text('Producto', 60, y);
	doc.text('Descripción', 100, y);
	doc.text('Cantidad', 135, y);
	doc.text('Costo', 160, y);
	doc.text('Precio Venta', 180, y);
  
	y += 10;
	productDetails.forEach((product) => {
	  doc.text(product.barcode.toString(), 20, y);
	  doc.text(product.name.toString(), 60, y);
	  doc.text(product.description, 100, y);
	  doc.text(product.cantidad.toString(), 135, y);
	  doc.text(product.costo.toString(), 160, y);
	  doc.text(product.price.toString(), 180, y);
	  
	 
	  y += 10;
	});
  
	// // Agregar los totales
	doc.setFontSize(12);
	doc.text(`Total Producto:$ ${totalAmount.toString()}`, 20, y + 20);
	// doc.text(`Iva 16%: ${ivaTotal.toString()}`, 20, y + 30);
	// doc.text(`Total más Iva: ${amount.toString()}`, 20, y + 40);
  
	// Agregar los métodos de pago
	// doc.setFontSize(14);
	// doc.text('Métodos de Pago:', 20, y + 60);
  
	// y += 70;
	// doc.setFontSize(12);
	// metodoPago.forEach((metodo, index) => {
	//   doc.text(`Método ${index + 1}: ${metodo.method}`, 20, y + index * 10);
	//   doc.text(`Monto: ${metodo.amount.toFixed(2)}`, 60, y + index * 10);
	// });
  
	// Guardar el documento PDF
	doc.save('ResumenCompra.pdf');
  };
	
return(	<>

<FormTipo>
<Typography style={{marginLeft:15, marginTop:10, color:"white"}} color="black" variant="h5" sx={{ marginBottom: 2 }}>
        Lista de Compras Realizadas
        </Typography>
		</FormTipo>
		
       
	<hr />
	{/* Modal Ver Compra */}
	<Modal
	  open={selectedPurchase !== null}
	  onClose={() => setSelectedPurchase(null)}
	>
	  <Box
		   sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
	  >
		{/* Aquí va el contenido del modal */}
		{selectedPurchase && (
		  <>
			<h2>{selectedPurchase.name}</h2>
			<p>
			  <strong>Fecha de Compra:</strong> {  fDateTime(selectedPurchase.createdAt)}
			</p>
			<p>
			  <strong>Numero de Compra:</strong> {selectedPurchase.purchaseNumber}
			</p>
			<p>
			  <strong>Numero de Factura:</strong> {selectedPurchase.invoiceNumber}
			</p>
			<p>
			  <strong>Proveedor:</strong> {capitalizeFirstLetter(selectedPurchase.supplierName)}
			</p>
			<p>
			  <strong>Rif:</strong> {capitalizeFirstLetter(selectedPurchase.supplierRif)}
			</p>
			<p>
			  <strong>Direccion:</strong> {capitalizeFirstLetter(selectedPurchase.supplierAddress)}
			</p>
			<h3>Lista de Productos:</h3>
    <ul>
      {(selectedPurchase.productDetails).map((product) => (
        <li key={product.barcode}>
			<strong>Código:</strong> {product.barcode}<br />
          <strong>Producto:</strong> {product.name}<br />
          <strong>Descripción:</strong> {product.description}<br />
          <strong>Cantidad:</strong> {product.cantidad}<br />
		  <strong>precio de Compra :</strong> {product.costo.toFixed(2)}<br />
          <strong>Precio para venta:</strong> {product.price.toFixed(2)}<br />
         
        </li>
      ))}
    </ul>

			<p>
			  <strong>Total Compra:</strong> {selectedPurchase.totalAmount.toFixed(2)}
			</p>
			<Button
			  variant="contained"
			  onClick={() => setSelectedPurchase(null)}
			>
			  Cerrar
			</Button>

			
			<Button variant="contained" onClick={generatePDF} style={{marginLeft:10, backgroundColor:'red'}}>
          Generar PDF
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
		
		  <h2>Editar Compra</h2>
		  {selectedPurchaseEdit && (
			<form
			  onSubmit={(e) => {
				e.preventDefault();
			  }}
			>
			  <FormContainer>
			<FieldContainer>
			  <TextField
				  type="text"
				  value={setSelectedPurchaseId.id}
				  onChange={(e) =>
					setSelectedPurchaseId({
					  ...selectedPurchaseId,
					  id: e.target.value,
					})
				  }
				/>
			 
			 <TextField
				label="Nombre"
			 
				  type="text"
				  value={selectedPurchaseEdit.supplierName}
				  onChange={(e) =>
					setSelectedPurchaseEdit({
					  ...selectedPurchaseEdit,
					  supplierName: e.target.value,
					})
				  }
				/>
			 
			  <br />
			  <TextField
				  label= "Rif"
				  name="supplierRif"
				  value={selectedPurchaseEdit.supplierRif}
				  onChange={(e) =>
					setSelectedPurchaseEdit({
					  ...selectedPurchaseEdit,
					  supplierRif: e.target.value,
					})
				  }
				/>

<TextField
				  label= "Numero de Compra"
				  name="purchaseNumber"
				  value={selectedPurchaseEdit.purchaseNumber}
				  onChange={(e) =>
					setSelectedPurchaseEdit({
					  ...selectedPurchaseEdit,
					  purchaseNumber: e.target.value,
					})
				  }
				/>
				<TextField
				  label= "Numero de Factura"
				  name="invoiceNumber"
				  value={selectedPurchaseEdit.invoiceNumber}
				  onChange={(e) =>
					setSelectedPurchaseEdit({
					  ...selectedPurchaseEdit,
					  invoiceNumber: e.target.value,
					})
				  }
				/>
			  

			
			 
			 
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

	<Box sx={{ m: 2 }}>
	  <TextField
		label="Buscar Compras"
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
	  />
	  {/* <Button variant="contained" onClick={handleSearch}>
		Buscar
	  </Button> */}
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

		  {Array.isArray(compras?.purchases) &&
    compras?.purchases
      .filter((items) =>
        items.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((items) => (
        <TableRow key={items.id}>
          <TableCell align="left"> {items.purchaseNumber}</TableCell>
          <TableCell align="left"> {items.invoiceNumber}</TableCell>
          <TableCell align="left"> {items.totalAmount.toFixed(2)}</TableCell>
          <TableCell align="left"> {capitalizeFirstLetter(items.supplierName)}</TableCell>
          <TableCell align="left"> {capitalizeFirstLetter(items.supplierRif)}</TableCell>
				  
		  <TableCell align="left"> {capitalizeFirstLetter(items.status)}</TableCell>
				  
				  <>
					<TableCell className="tableCell">
					  <Button
						variant="contained"
						onClick={() => setSelectedPurchase(items)}
					  >
						Ver Compra
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
					
					  <Button variant='contained' style={{backgroundColor:"red"}} id={items.id}
						onClick={() => deleteHandler(items)}>Borrar</Button>
					
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
		  count={compras.purchases.length}
		  rowsPerPage={rowsPerPage}
		  page={page}
		  onPageChange={handleChangePage}
		  onRowsPerPageChange={handleChangeRowsPerPage}
		 />
	  </TableContainer>

	  <hr />
	</Box>

	<FloatingButtonComponent/>
  </>)
};

export const TablePurchasesStyle = styled.div``;

export default TablePurchases;
