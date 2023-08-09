/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';
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

  import {   generarCierreMensual } from '../../redux/modules/cierresMEnsuales';


  const FormContainer = styled.form `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;


const GenerateCierreMensual = () => {
	const [fechaInicio, setFechaInicio] = useState('');
	const [fechaFin, setFechaFin] = useState('');
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const dispatch = useDispatch()
	
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
  
	const cierrem = useSelector((state)=> state.cierre);
	const cierremF = useSelector((state)=> state.cierre);

	console.log("cierrem", cierrem)
	
	console.log("cierremF", cierremF)


	
	const handleGenerarCierreMensual = () => {
		// Lógica para generar el cierre mensual
		dispatch(generarCierreMensual(fechaInicio, fechaFin));
	  };
	
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
			const response = await dispatch(generarCierreMensual(fechaInicio,fechaFin));
	
			if (response.inventarioInicial&& response.inventarioInicial.length > 0) {
			  setSuccessMessage("Ciere Mensual Generado");
			  
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
		XLSX.writeFile(wb, 'resumen-cierre-mensual-inventarios.xlsx');
	  };
	
	
	  const handleGenerateExcel = () => {
		const data = cierrem?.cierre?.inventarioInicial.map((producto) => ({
		  Codigo: producto?.barcode,
		  Producto: producto?.name,
		  Costo: producto?.costo,
		  'Precio Ventas': producto?.price,
		  Cantidad: producto?.quantityChange,
		}));
	
		generateExcel(data);
	  };

	  const handleGenerateExcelIF = () => {
		const data = cierremF?.cierre?.inventarioFinal.map((producto) => ({
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
	
	<h2>Inventario Inicial</h2>
			<h3>Fecha Seleccionada</h3> {fechaInicio} /  {fechaFin}
			<hr/>
	<FormContainer onSubmit={handleSubmit}>
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
					  type='submit'
				  >
					  Generar Cierre Mensual
				  </Button>
			  </Grid>
			  </FormContainer>


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
            {Array.isArray(cierrem?.cierre?.inventarioInicial) && cierrem?.cierre?.inventarioInicial?.length > 0 ?(
				 cierrem.cierre?.inventarioInicial 
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
            count={cierrem?.cierre?.inventarioInicial?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
           />

      </TableContainer>
	  <Button variant='contained' onClick={handleGenerateExcel}>
        <DescriptionIcon />
        Generar Archivo Excel Inv I
      </Button>


<hr/>



<h2>Inventario Final</h2>
			<h3>Fecha Seleccionada</h3> {fechaInicio} /  {fechaFin}
			<hr/>

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
            {Array.isArray(cierremF?.cierre?.inventarioFinal) && cierremF?.cierre?.inventarioFinal?.length > 0 ?(
				 cierremF?.cierre?.inventarioFinal 
				  .filter((producto) =>
				  producto?.barcode.toLowerCase().includes(searchTerm.toLowerCase())
				)
				 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
				// eslint-disable-next-line arrow-body-style
				.map((producto) => {

					return(
              <TableRow key={producto.productId}>
				<TableCell>{producto.barcode}</TableCell>
                <TableCell>{producto.name}</TableCell>
				<TableCell>${producto.costo}</TableCell>
				<TableCell>${producto.price}</TableCell>
                <TableCell>{producto.quantityChange}</TableCell>
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
            count={cierremF?.cierre?.inventarioFinal?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
           />

      </TableContainer>
	  <Button variant='contained' onClick={handleGenerateExcelIF}>
        <DescriptionIcon />
        Generar Archivo Excel Inv F
      </Button>




	  <h2>Resumen</h2>
			<h3>Ventas Totales de el mes </h3> 
			
		<h3>	${cierrem?.cierre?.ventasTotales.toFixed(2)}</h3>
			<hr/>
			<h3>Compras Totales de el mes  </h3> 
			
			<h3>	${cierrem?.cierre?.comprasTotales.toFixed(2)}</h3>
	
	</>

	)
};

export const GenerateCierreMensualStl = styled.div``;

GenerateCierreMensual.propTypes = {};

export default GenerateCierreMensual;