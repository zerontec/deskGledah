import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid, 
 

} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getSalesStats, getSellerDebt, serachSellerById } from '../../../redux/modules/seller';


import { fDate, fDateTime } from '../../../utils/formatTime';
import { getProductsBySeller } from '../../../redux/modules/invoices';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';

const columns = [
	{
	  id: "id",
	  label: "Numero factura ",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Codigo Producto",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Producto",
	  minWidth: 50,
	},
	{
		id: "quantity",
		label: "cantidad",
		minWidth: 50,
	  },
    {
      id: "quantity",
      label: "Total Vendido",
      minWidth: 50,
      },
  ];


const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const SellerPerfil = () => {

	const { id} = useParams();
	const dispatch = useDispatch();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");

  
	const [seller, setSeller] = useState(null);
	const [sales, setSales] = useState([]);
	const [products, setProduct] = useState([]);

	const [debts, setDebts] = useState(null);

  
	
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	  };
	
	  const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	  };
	
	
	
    // function deleteHandler(item) {
    //   Swal.fire({
    //     title: 'Estas Seguro',
    //     text: 'No podras revertir esta operacion !',
    //     icon: 'advertencia',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Si, Borrar!',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       dispatch(deleteUpload(item.id));
    //       Swal.fire('la deuda  ha sido borrado!');
  
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 500);
    //     } else {
    //       Swal.fire('la cuenta  Esta Seguro !');
    //     }
    //   });
    // }
const empleado = useSelector((state)=> state.vendedores)
const productos = useSelector((state)=> state.invoice)
console.log(empleado)
console.log(productos)
console.log("debts", debts)
useEffect(() => {

	  // Llamada a la API para obtener los datos del cliente
	  dispatch(serachSellerById({id}))
		.then((response) => setSeller(response))
		.catch((error) => console.log(error));
		dispatch(getSalesStats({id}))
		.then((response) => setSales(response))
		.catch((error) => console.log(error));
	dispatch(getProductsBySeller({id}))
	.then((response) => setProduct(response))
		.catch((error) => console.log(error));	
    dispatch(getSellerDebt({id}))
    .then((response) => setDebts(response))
      .catch((error) => console.log(error));

	}, [id, dispatch]);
  

fDateTime()

	return (
	  <StyledContainer>
		{/* {customer && ( */}
		  <>
			<Box sx={{ marginBottom: '24px' }}>
			  <Typography variant="h4" component="h1">
				Perfil de Empleado:
			  </Typography>
			  <Typography variant="body1">
				
				<strong>Nombre: {empleado.vendedores.name}</strong> 
			  </Typography>
			  <Typography variant="body1">
				
				<strong>Cédula o Rif: {empleado.vendedores.identification}</strong> 
			  </Typography>
			 
			  <Typography variant="body1">
				
				<strong>Direccion: {empleado.vendedores.address}</strong> 
			  </Typography>

			  <Typography variant="body1">
				<strong>Fecha de Registro: {fDateTime(empleado.vendedores.createdAt)}</strong> 
			  </Typography>

          <Typography variant="body1">
				<strong>Fecha de Registro: </strong> 
			  </Typography>
        <hr/>
        <Typography variant="subtitle1">Deudas por Prestamos o Adelantos:</Typography>
          <Typography variant="h4">${debts?.debt}</Typography>
			   {/* <Typography variant="body1">
				

        {info.debts}
				<strong>Total gastado: {compra.invoices. totalPurchases}</strong> 
			  </Typography> */}
			  {/* Agrega más datos del cliente según tus necesidades */}
			</Box>


		
			  <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Estadísticas de Venta</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Ventas del día:</Typography>
          <Typography variant="h4">Bs.{sales.daySales}</Typography>
        </Grid>
        {/* <Grid item xs={4}>
          <Typography variant="subtitle1">Ventas de la semana:</Typography>
          <Typography variant="h4">Bs.{sales.weekSales}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Ventas del mes:</Typography>
          <Typography variant="h4">Bs.{sales.monthSales}</Typography>
        </Grid> */}
      </Grid>
    </Paper>


	<TableContainer component={Paper}>
  <Typography variant="h6">Productos Vendidos </Typography>


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
              
              {" "}
              {Array.isArray(productos.invoices.products) && productos.invoices.products.length  > 0 ? ( productos.invoices.products.filter((items) =>
                  items.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((items) => (
                  <TableRow key={items.id}>
                     <TableCell align="left"> {items.invoiceNumber}</TableCell>
                    <TableCell align="left"> {items.barcode}</TableCell>
                    <TableCell align="left"> {items.name}</TableCell>
                    <TableCell align="left"> {items.quantity}</TableCell>
                    <TableCell align="left"> {items.price}</TableCell>
                    {/* <TableCell className="tableCell">
                          <div className="deleteButton" id={item.id} onClick={() => deleteHandler(item)}>
                            <Button>Borrar</Button>
                          </div>
                        </TableCell>
                    */}
					<> 
                   
                      {/* <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedinvoices(items)}
                        >
                          Ver
                        </Button>
                      </TableCell> */}
                      
                    </>
                    </TableRow>
         ))
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
            count={productos.invoices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
           />
        </TableContainer>

        <FloatingButtonComponent/>
		  </>
		{/* // )} */}
	  </StyledContainer>





	);


	
};


export default SellerPerfil;
