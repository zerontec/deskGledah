/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';

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

import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import { Document, Page, pdfjs } from '@react-pdf/renderer';

import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import { fDateTime } from '../../../utils/formatTime';
import generatePDF from '../../../utils/generatePdf';
import { getAllNotas, updateNota, deleteNota } from '../../../redux/modules/notasC';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    label: 'Id',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Fecha',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Monto ',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'Factura',
    minWidth: 50,
  },
//   {
//     id: 'address',
//     label: 'precio',
//     minWidth: 150,
//   },
//   {
//     id: 'check',
//     label: 'Exitencia',
//   },
//   {
//     id: 'canti',
//     label: ' Defectuosos',
//   },
];
const NotasCredito = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedNota, setSelectedNota] = useState(null);
	const [errors, setErrors] = useState({});
	const [selectedNotaId, setSelectedNotaId] = useState(null);
	const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(true);
  
	const [showPreview, setShowPreview] = useState(false);
	const [numPages, setNumPages] = useState(null);
  
	const [notaMonto, setNotaMonto] = useState('');
	const [notaDate, setNotaDate] = useState('');
	const [notaDescription, setNotaDescription] = useState('');
	const [pdfContent, setPdfContent] = useState(null);
	
	
	
	const generatePDF = (nota) => {
		const content = (
		  <Document>
			<Page>
			  <h1>Título del PDF</h1>
			  <p>Producto: {notaMonto}</p>
			  <p>Precio: ${notaDescription}</p>
			  <p>Descripción: {notaDate}</p>
			  {/* Agrega más contenido según tus necesidades */}
			</Page>
		  </Document>
		);
	
		setNumPages(1);
		setShowPreview(true);
		setPdfContent(content);
	  };


	  const [selectedNotas, setSelectedNotas] = useState([]);

	  const handleToggleSelect = (itemsId) => {
		if (selectedNotas.includes(itemsId)) {
		  setSelectedNotas(selectedNotas.filter((id) => id !== itemsId));
		} else {
		  setSelectedNotas([...selectedNotas, itemsId]);
		}
	  };
	
	
	
	
	  const handlePrintClick = () => {
		window.print();
	  };
	
	  const handleDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	  };
	
	  const dispatch = useDispatch();
	
	  useEffect(() => {
		// Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
		dispatch(getAllNotas());
	  }, [dispatch]);
	
	  const notasc = useSelector((state) => state.notasc);
	  console.log("notas",notasc);
	
	  const handleEditClick = (nota) => {
		setSelectedNotaId(nota.id);
		setSelectedNotaEdit({
			nombre:nota.clienteData.name,
			identificacion:nota.clienteData.identification,
			direccion:nota.clienteData.address,
			monto: nota.monto,
		  	factura: nota.facturaAfectada,
		
		});
		setOpen(true);
	  };
	  const [selectedNotaEdit, setSelectedNotaEdit] = useState({
		monto: '',
		factura: '',
		nombre:'',
		identificacion:'',
		direccion:''
		
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
			dispatch(deleteNota(items.id));
			Swal.fire('El producto ha sido borrado!');
	
			setTimeout(() => {
			  window.location.reload();
			}, 500);
		  } else {
			Swal.fire('El producto  Esta Seguro !');
		  }
		});
	  }
	
	  const handleCloseModal = () => {
		setSelectedNotaId(null);
		setSelectedNotaEdit({
			monto: '',
			factura: '',
			nombre:'',
			identificacion:'',
			direccion:''
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
		if (selectedNotaEdit.name && selectedNotaEdit.description && selectedNotaEdit.price) {
		  e.preventDefault();
	
		  const data = {
			...selectedNotaEdit,
			id: selectedNotaId,
		  };
		  dispatch(updateNota(selectedNotaId, data));
		  Swal.fire('¨Producto Editado con Exito  !', 'You clicked the button!', 'success');
		  dispatch(getAllNotas());
	
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
	fDateTime();

	function capitalizeFirstLetter(text) {
		if (!text) return '';
		return text.charAt(0).toUpperCase() + text.slice(1);
	  }
	
	//   const isDeleteButtonDisabled = selectedNota.length === 0;
	
	  return (
		<>
		  <hr />
		  {/* Modal Ver Analysis */}
		  <Modal open={selectedNota !== null} onClose={() => setSelectedNota(null)}>
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
			  {selectedNota && (
				<>
				  <h2>{selectedNota.name}</h2>
				  <p>
					<strong>Fecha:</strong> {fDateTime(selectedNota.fecha)}
				  </p>
				  <p>
					<strong>Nota de Credito Numero  :</strong> {selectedNota.numeroNota}
				  </p>
				  <p>
					<strong>Monto:</strong> {selectedNota.monto}
				  </p>
				  <h3>Datos de Cliente:</h3>
				  <p>
					<strong>Nombre:</strong> {capitalizeFirstLetter(selectedNota.clienteData.name)}
				  </p>
				  <p>
					<strong>Identificacion:</strong> {selectedNota.clienteData.identification}
				  </p>
				  <p>
					<strong>Direccion:</strong> {capitalizeFirstLetter(selectedNota.clienteData.address)}
				  </p>
				  {/* <p>
					<strong>Cantidad:</strong> {selectedNota.quantity}
				  </p>
				  <p>
				  <strong>Defectusos:</strong> {selectedNota.defectuosos}
				</p> */}
				  <Button variant="contained" onClick={() => setSelectedNota(null)}>
					Cerrar
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
			  <h2>Editar Nota</h2>
			  {selectedNotaEdit && (
				<form
				  onSubmit={(e) => {
					e.preventDefault();
				  }}
				>
				  <FormContainer>
					<FieldContainer>
					  <TextField
						type="text"
						value={setSelectedNotaId.id}
						onChange={(e) =>
						  setSelectedNotaId({
							...selectedNotaId,
							id: e.target.value,
						  })
						}
					  />
	
					
					  <br />
					  <TextField
						label="Nombre"
						name="name"
						value={selectedNotaEdit.nombre}
						onChange={(e) =>
						  setSelectedNotaEdit({
							...selectedNotaEdit,
							nombre: e.target.value,
						  })
						}
					  />
	
					  <TextField
						label="identificacion"
						name="identificacion"
						value={selectedNotaEdit.identificacion}
						onChange={(e) =>
						  setSelectedNotaEdit({
							...selectedNotaEdit,
							identificacion: e.target.value,
						  })
						}
					  />
						   <TextField
						label="Direccion"
						name="direccion"
						value={selectedNotaEdit.direccion}
						onChange={(e) =>
						  setSelectedNotaEdit({
							...selectedNotaEdit,
							direccion: e.target.value,
						  })
						}
					  />
	  <TextField
						label="Monto"
						type="text"
						value={selectedNotaEdit.monto}
						onChange={(e) =>
						  setSelectedNotaEdit({
							...selectedNotaEdit,
							monto: e.target.value,
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
			<TextField label="Buscar Productos" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			<Button variant="contained" onClick={handleSearch}>
			  Buscar
			</Button>
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
	  
				  {Array.isArray(notasc.notas) && notasc.notas.length > 0 ?(
					notasc.notas
					  .filter((items) => items.monto.toLowerCase().includes(searchTerm.toLowerCase()))
					  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
					  .map((items) => (
	
						
						<TableRow key={items.id}>
							
							<TableCell align="left"> {items.numeroNota}</TableCell>
						  <TableCell align="left"> {fDateTime(items.fecha)}</TableCell>
						 
						  <TableCell align="left"> {items.monto}</TableCell>
						  <TableCell align="left"> {items.facturaAfectada}</TableCell>
						  {/* <TableCell align="left"> {items.quantity}</TableCell>
						  <TableCell align="left"> {items.defectuosos}</TableCell>
				    */}
		
					

						  <>
							<TableCell className="tableCell">
							  <Button variant="contained" onClick={() => setSelectedNota(items)}>
								Ver
							  </Button>
							</TableCell>
							<TableCell className="tableCell">
							  
							  <Button variant="contained" onClick={() => handleEditClick(items)}>
								Editar
							  </Button>
							</TableCell>
	
							<TableCell className="tableCell">
							  <div className="deleteButton" id={items.id} onClick={() => deleteHandler(items)}>
								<Button>Borrar</Button>
							  </div>
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
				count={notasc.notas.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			   />
	
	
	
			</TableContainer>
	<hr/>
			{/* Agrega el botón para generar el PDF */}
			<button onClick={generatePDF}>Generar PDF</button>
	
			{/* Muestra el botón de imprimir */}
			{pdfContent && (
			  <div>
				<Button variant="contained" onClick={handlePrintClick}>
				  Imprimir
				</Button>
	
				<Document file={pdfContent}>
				  <Page pageNumber={1} />
				</Document>
			  </div>
			)}
		  </Box>
		</>
	  );
	};
	
export const NotasCreditoStl = styled.div``;

NotasCredito.propTypes = {};

export default NotasCredito;