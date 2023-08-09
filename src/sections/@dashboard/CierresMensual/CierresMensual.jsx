/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { useDispatch, useSelector } from 'react-redux';
import TablePagination from "@mui/material/TablePagination";
import DescriptionIcon from '@mui/icons-material/Description';
import Paper from "@mui/material/Paper";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Grid,
	Snackbar
  
  } from '@mui/material';

  import Swal from 'sweetalert2';


import { fetchInventarioInicial, fetchInventarioFinal, generarCierreMensual, showInventoryByDate } from '../../../redux/modules/cierresMEnsuales';
import { GenerateCierreMensual } from '../../../components/GenerateCierreMensual';


  const FormContainer = styled.form `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const CierresMensual = () => {
	const dispatch = useDispatch();
//   const inventarioI = useSelector(state => state.cierres.inventarioI);
//   const inventarioF = useSelector(state => state.inventarioF);
//   const cierre = useSelector(state => state.cierre);
  const [fechaInicio, setFechaInicio] = useState('');
  const [inventarioInicial, setInventarioInicial] = useState([]); // Estado para el inventario inicial
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 
  const [fechaFin, setFechaFin] = useState('');

 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");


  const handleGenerarInventarioInicial = () => {
    // Lógica para generar el inventario inicial
    dispatch(fetchInventarioInicial());
  };

  const handleGenerarInventarioFinal = () => {
    // Lógica para generar el inventario final
    dispatch(fetchInventarioFinal());
  };


const inventarioi = useSelector((state)=> state.cierre)

 console.log("inventarioi", inventarioi)
  
 
 const handleSubmit = async (event) => {
	event.preventDefault();

	try {
	  if (!fechaInicio|| !fechaFin) {
		setErrorMessage("Por favor, ingresa ambas fechas.");
		return;
	  }

	  const data = {
		// eslint-disable-next-line object-shorthand
		fechaInicio: fechaInicio,
		// eslint-disable-next-line object-shorthand
		fechaFin: fechaFin,
		// page: currentPage, // Agrega el número de página actual
		// pageSize: 10, // Puedes ajustar el tamaño de página aquí
	  };

	  console.log(fechaInicio,fechaFin);
	  
	  try {
		const response = await dispatch(showInventoryByDate(fechaInicio,fechaFin));

		if (response.inventarioInicial&& response.inventarioInicial.length > 0) {
		  setSuccessMessage("Inevntario Encontrado");
		  
		  // setCurrentPage(1);
		   // Restablecer la página actual al realizar una nueva búsqueda
		} else if (response.error) {
		  setErrorMessage(response.error);
		}

		
	   
	  } catch (error) {
		setErrorMessage(error.message);
	  }
	} catch (error) {
	  setErrorMessage(error.message);
	}
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generateExcel = (data) => {
	const ws = XLSX.utils.json_to_sheet(data);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Resumen Cierre Mensual');
	XLSX.writeFile(wb, 'resumen-Inventario-inicial.xlsx');
  };


  const handleGenerateExcel = () => {
    const data = inventarioi?.inventarioI?.inventarioInicial.map((producto) => ({
      Codigo: producto?.barcode,
      Producto: producto?.name,
      Costo: producto?.costo,
      'Precio Ventas': producto?.price,
      Cantidad: producto?.quantityChange,
    }));

    generateExcel(data);
  };

  return (
    <>
		  <Grid container justifyContent="center" alignItems="center" spacing={2}>
			  <Grid item>
				  <Button
					  variant="contained"
					  onClick={handleGenerarInventarioInicial}
				  >
					  Generar Inventario Inicial de el mes
				  </Button>
			  </Grid>
			  <Grid item>
				  <Button
					  variant="contained"
					  onClick={handleGenerarInventarioFinal}
				  >
					  Generar Inventario Final de el mes
				  </Button>
			  </Grid>
			 
			  <Grid item>
			<Link to='/dashboard/cierre-mensual'>  <Button
					  variant="contained"
					  
				  >
					 Ir a Cierre Mensual
				  </Button></Link>	
			  </Grid>

			

		  </Grid>
<hr/>


{/* LLamar a generar Cierre eMensual  */}

			




			  <FormContainer onSubmit={handleSubmit}>
			  <Grid container justifyContent="rigth" alignItems="center" spacing={2}>
			  <Grid item>
				  <TextField
					  label="Fecha Inicio"
					  type="date"
					  value={fechaInicio}
					  onChange={(e) => setFechaInicio(e.target.value)} />
			  </Grid>
			  <Grid item>
				  <TextField
					  label="Fecha Fin"
					  type="date"
					  value={fechaFin}
					  onChange={(e) => setFechaFin(e.target.value)} />
			  </Grid>
			  <Grid item>
				  <Button
					  variant="contained"
					  type="submit"
				  >
					  Mostrar inventario 
				  </Button>
			  </Grid>
				</Grid>
				</FormContainer>

				<Snackbar
            open={!!errorMessage || !!successMessage}
            autoHideDuration={3000}
            onClose={() => {
              setErrorMessage("");
              setSuccessMessage("");
            }}
            message={errorMessage || successMessage}
          />
		  <h2>Inventario Inicial</h2>
			<h3>Fecha Seleccionada</h3> {fechaInicio} /  {fechaFin}
			<hr/>

			{/* TABLA DE INVENTARIO INICIAL  */}

		  <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {/* Botones y campos de fecha */}
      </Grid>
      {/* Mostrar la tabla de inventario inicial */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
			<TableCell>Codigo</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Costo</TableCell>
			  <TableCell>Precio Ventas</TableCell>
			  <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(inventarioi?.inventarioI?.inventarioInicial) && inventarioi?.inventarioI?.inventarioInicial.length > 0 ?(
				 inventarioi?.inventarioI?.inventarioInicial 
				  .filter((producto) =>
				  producto?.barcode.toLowerCase().includes(searchTerm.toLowerCase())
				)
				 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
				// eslint-disable-next-line arrow-body-style
				.map((producto) => {

					return(
              <TableRow key={producto?.productId}>
				<TableCell>{producto?.barcode}</TableCell>
                <TableCell>{producto?.name}</TableCell>
				<TableCell>${producto?.costo}</TableCell>
				<TableCell>${producto?.price}</TableCell>
                <TableCell>{producto?.quantityChange}</TableCell>
              </TableRow>
            );
		})
	) : (
		<TableRow>
		<TableCell colSpan={6}>No hay datos disponibles</TableCell>
	  </TableRow>
	)}
          </TableBody>
        </Table>

		<TablePagination
            rowsPerPageOptions={[5,10, 100]}
            component="div"
            count={inventarioi?.inventarioI?.inventarioInicial?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
           />

      </TableContainer>

	  <Button variant='contained' onClick={handleGenerateExcel}>
        <DescriptionIcon />
        Generar Archivo Excel
      </Button>


	  </>
	 
    
  );
};


export default CierresMensual;