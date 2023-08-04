/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React,{useEffect,useState} from 'react';

import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';

import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Checkbox } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import { jsPDF } from "jspdf";



import { fDateTime } from '../../../utils/formatTime';
import { deleteDevolution, getAllDevolution, updateDevolution } from '../../../redux/modules/devolucionV';


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
    id: 'id',
    label: 'Seleccion',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'ID Devolucion ',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Fecha ',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'Numero De Factura',
    minWidth: 50,
  },
  {
    id: 'address',
    label: 'Motivo ',
    minWidth: 150,
  },
  {
    id: 'check',
    label: 'Monto Devolucion',
  },
//   {
//     id: 'canti',
//     label: ' Defectuosos',
//   },
];






const Devolutions = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);

	const [selectedProductId, setSelectedProductId] = useState(null);
	const [open, setOpen] = useState(false);


	
  





	fDateTime()




	const [selectedProducts, setSelectedProducts] = useState([]);

	const handleToggleSelect = (itemsId) => {
	  if (selectedProducts.includes(itemsId)) {
		setSelectedProducts(selectedProducts.filter((id) => id !== itemsId));
	  } else {
		setSelectedProducts([...selectedProducts, itemsId]);
	  }
	};


	



	  const dispatch = useDispatch();

	  useEffect(() => {
		// Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
		dispatch(getAllDevolution());
	  }, [dispatch]);


	
	  const devoluciones = useSelector((state) => state.devolution);
	  console.log(devoluciones);
	

	  const handleEditClick = (product) => {
		setSelectedProductId(product.id);
		setSelectedProductEdit({
		  name: product.name,
		  description: product.description,
		  price: product.price,
		});
		setOpen(true);
	  };
	  const [selectedProductEdit, setSelectedProductEdit] = useState({
		name: '',
		description: '',
		price: '',
	  });
	
	  function deleteHandler(items) {
		Swal.fire({
		  title: 'Estas Seguro',
		  text: 'No podras revertir esta operacion !',
		  icon: 'advertencia',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, Borrar!',
		}).then((result) => {
		  if (result.isConfirmed) {
			dispatch(deleteDevolution(items.id));
			Swal.fire('La Devolucion ha sido borrado!');
	
			setTimeout(() => {
			  window.location.reload();
			}, 500);
		  } else {
			Swal.fire('La Devolucion  Esta Seguro !');
		  }
		});
	  }
	
	  const handleCloseModal = () => {
		setSelectedProductId(null);
		setSelectedProductEdit({
		  name: '',
		  description: '',
		  price: '',
		  quantity: 0,
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
		if (selectedProductEdit.name && selectedProductEdit.description && selectedProductEdit.price) {
		  e.preventDefault();
	
		  const data = {
			...selectedProductEdit,
			id: selectedProductId,
		  };
		  dispatch(updateDevolution(selectedProductId, data));
		  Swal.fire('¨Devolucion editada con Exito  !', 'You clicked the button!', 'success');
		  dispatch(getAllDevolution());
	
		  handleCloseModal();
		  //   getAllAnalysis();
		} else {
		  Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Debe completar toda la informacion !',
		  });
	
		  handleCloseModal();
		}
	  };
	
	  const handleSearch = () => {
		// Lógica para realizar la búsqueda de pacientes en la API y actualizar el estado del componente con los resultados.
	  };
	
	
	  const isDeleteButtonDisabled = selectedProducts.length === 0;

//  fDate();
 function capitalizeFirstLetter(text) {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const generatePDF = () => {
	if (!selectedProduct) {
	  return;
	}
  
	const {productoD,total,customerData,fechaVentaF, fechaDevolucion,motivo, invoiceNumber } = selectedProduct;
  
	if (!Array.isArray(productoD)) {
		console.error('productoD no es un array válido');
		return;
	  }
	// Crear un nuevo documento PDF
	// eslint-disable-next-line new-cap
	const doc = new jsPDF();
  
	// Agregar el número de factura
	doc.setFontSize(16);
	doc.text(`Número de Factura: ${invoiceNumber}`, 20, 20);
  
	// Agregar la fecha de la factura
	doc.setFontSize(12);
	doc.text(`Fecha de Factura: ${fDateTime(fechaVentaF)}`, 20, 30);
	doc.text(`Fecha de Devolucion: ${fDateTime(fechaDevolucion)}`, 20, 40);
  
  
	// Agregar los datos generales de la factura
	doc.setFontSize(12);

	doc.text(`Cliente: ${customerData.name}`, 20, 60);
	doc.text(`Cédula o Rif: ${customerData.identification}`, 20, 70);
	doc.text(`Motivo: ${motivo}`, 20, 80);
	
  
  
	// Agregar la lista de productos
	doc.setFontSize(14);
	doc.text('Lista de Productos:', 20, 110);
  
	let y = 120;
	doc.setFontSize(12);
	doc.text('Código', 20, y);
	doc.text('Producto', 60, y);
	doc.text('Cantidad', 120, y);
	
  
	y += 10;
	productoD.forEach((devolution) => {
	  doc.text(devolution.barcode, 20, y);
	//   doc.text(devolution.name, 60, y);
	  doc.text(devolution.quantity, 120, y);
	  
	  y += 10;
	});
  
	// Agregar los totales
	doc.setFontSize(12);
	doc.text(`Total Producto devolucion: ${total.toString()}`, 20, y + 20);

  
	// Guardar el documento PDF
	doc.save('Devolucion.pdf');
  };
  




	  return (
		<>
		  <hr />
		  {/* Modal Ver Analysis */}
		  <Modal open={selectedProduct !== null} onClose={() => setSelectedProduct(null)}>
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
			  {selectedProduct && (
				<> 
				
				  <p>
					<strong> Numnero Factura de Venta:</strong> {selectedProduct.invoiceNumber}
				  </p>
				  <p>
				  <strong>Fecha de Venta:</strong> {fDateTime(selectedProduct.fechaVentaF)}
				</p>
				  <p>
				  <strong>Fecha Devolucion:</strong> {fDateTime(selectedProduct.fechaDevolucion)}
				</p>
			
				<p>
					<strong>Motivo:</strong> {capitalizeFirstLetter(selectedProduct.motivo)}
				  </p>


				  <h3> Datos Cliente:</h3>
    <ul>
      
        <li >
           <strong>Nombre :  </strong> {capitalizeFirstLetter(selectedProduct.customerData.name)}<br />
           <strong>Cedula o Rif: </strong> {capitalizeFirstLetter(selectedProduct.customerData.identification)}<br />
          
         
          <strong>Direccion:  </strong> {capitalizeFirstLetter(selectedProduct.customerData.address)}<br />
           <br />
        </li>
      
    </ul>


				  <h3> Productos Devueltos:</h3>
    <ul>
      {selectedProduct?.productoD.map((devolutions) => (
        <li key={devolutions.barcode}>
           <strong>Código :  </strong> {devolutions?.barcode}<br />
           <strong>Producto: </strong> {devolutions?.name}<br />
          
         
          <strong>Cantidad:  </strong> {devolutions?.quantity}<br />
           <br />
        </li>
      ))}
    </ul>
	<p>
					<strong>Total devolucion:</strong> {selectedProduct.total}
				  </p> 
		
				  <Button variant="contained" onClick={() => setSelectedProduct(null)}>
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
	
		  {/* Modal para editar el análisis */}
		  <Modal open={open} onClose={handleCloseModal}>
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
			  <h2>Editar Producto</h2>
			  {selectedProductEdit && (
				<form
				  onSubmit={(e) => {
					e.preventDefault();
				  }}
				>
				  <FormContainer>
					<FieldContainer>
					  <TextField
						type="text"
						value={setSelectedProductId.id}
						onChange={(e) =>
						  setSelectedProductId({
							...selectedProductId,
							id: e.target.value,
						  })
						}
					  />
	
					  <TextField
						label="Nombre"
						type="text"
						value={selectedProductEdit.name}
						onChange={(e) =>
						  setSelectedProductEdit({
							...selectedProductEdit,
							name: e.target.value,
						  })
						}
					  />
	
					  <br />
					  <TextField
						label="Descripción"
						name="description"
						value={selectedProductEdit.description}
						onChange={(e) =>
						  setSelectedProductEdit({
							...selectedProductEdit,
							description: e.target.value,
						  })
						}
					  />
	
					  <TextField
						label="Precio"
						name="price"
						value={selectedProductEdit.price}
						onChange={(e) =>
						  setSelectedProductEdit({
							...selectedProductEdit,
							price: e.target.value,
						  })
						}
					  />
	
					  <br />
					</FieldContainer>
					<ActionsContainer>
					  <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>
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
			<TextField label="Buscar Devoluciones" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			<Button variant="contained" onClick={handleSearch}>
			  Buscar
			</Button>
		<Link to='/dashboard/notas-credito'>	<Button style={{marginLeft:10}} variant="contained" onClick={handleSearch}>
			Notas de Credito Generadas
			</Button></Link>

						

			<TableContainer component={Paper}>
			  <Table sx={{ minWidth: 650 }}>
				<TableHead>
				  <TableRow>
					{' '}
					{columns.map((column) => (
					  <TableCell key={column.id} align="left" minWidth={column.minWidth}>
						{' '}
						{column.label}{' '}
					  </TableCell>
					))}{' '}
				  </TableRow>
				</TableHead>
			  
				<TableBody>
				  {' '}
	  
				  {Array.isArray(devoluciones.devolutions) && devoluciones.devolutions.length > 0 ?(
					devoluciones.devolutions
					  .filter((items) => items.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
					
					  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
					  .map((items) => (
	
						
						<TableRow key={items.id}>
							
							 <Checkbox
					  checked={selectedProducts.includes(items.id)}
					  onChange={() => handleToggleSelect(items.id)}
					/>
						  <TableCell align="left"> {items.numeroDevolucion}</TableCell>
						  <TableCell align="left"> {fDateTime(items.fechaDevolucion)}</TableCell>
						  <TableCell align="left"> {items.invoiceNumber}</TableCell>
						  <TableCell align="left"> {capitalizeFirstLetter(items.motivo)}</TableCell>
						  <TableCell align="left"> {items.total}</TableCell>
						  
						  
						  <TableCell align="left"> {items.defectuosos}</TableCell>
				   
						  <>
							<TableCell className="tableCell">
							  <Button variant="contained" onClick={() => setSelectedProduct(items)}>
								Ver
							  </Button>
							</TableCell>
							<TableCell className="tableCell">
							  
							  <Button variant="contained" onClick={() => handleEditClick(items)}>
								Editar
							  </Button>
							</TableCell>
	
							<TableCell className="tableCell">
							  
								<Button variant='contained' style={{backgroundColor:"red", color:"white"}}   id={items.id} onClick={() => deleteHandler(items)}>Borrar</Button>
							
							</TableCell>
						  </>
	
				
						</TableRow>
					  ))
					  ):(
						<TableRow>
						<TableCell colSpan={6}>No hay datos disponibles</TableCell>
					  </TableRow>
					)}
				</TableBody>
			 
			  </Table>
			  <TablePagination
				rowsPerPageOptions={[5, 10, 100]}
				component="div"
				count={devoluciones.devolutions.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			   />
	
	{/* <Button variant="contained" onClick={handleDeleteMultipleClick} disabled={isDeleteButtonDisabled}>Borrar seleccionados</Button> */}
	
			</TableContainer>
	<hr/>
			
			
			
			
		  </Box>
		</>
	  );
	};
	

export const ProductDStyle = styled.div``;

export default Devolutions;
