import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import styled from 'styled-components';
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

} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {  serachCustomeById, getSellerDebt } from '../../../redux/modules/customer';
import { getClientPurchase } from '../../../redux/modules/invoices';
// import { getCustomerById } from   'tu_accion_para_obtener_cliente_por_id';
// import { getCustomerPurchases } from 'tu_accion_para_obtener_compras_de_cliente';

import { fDate, fDateTime } from '../../../utils/formatTime';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';

const columns = [
	{
	  id: "id",
	  label: "Numero Factura",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Fecha",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Monto",
	  minWidth: 50,
	},
	
  ];


const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const CustomerPerfil = () => {

	const { id} = useParams();
	const dispatch = useDispatch();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");

  
	const [customer, setCustomer] = useState(null);
	const [compras, setCompras] = useState([]);
	const [debts, setDebts] = useState(null);



	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	  };
	
	  const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	  };
	
	
	console.log("compra estado", compras)

const cliente = useSelector((state)=> state.customer)
const compra = useSelector((state) => state.invoice)
console.log(cliente)
console.log("compra", compra)
useEffect(() => {

	  // Llamada a la API para obtener los datos del cliente
	  dispatch(serachCustomeById({id}))
		.then((response) => setCustomer(response))
		.catch((error) => console.log(error));
		dispatch(getClientPurchase({id}))
		.then((response) => setCompras(response))
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
				Perfil de Cliente:
			  </Typography>
			  <Typography variant="body1">
				
				<strong>Nombre: {cliente?.customers?.name}</strong> 
			  </Typography>
			  <Typography variant="body1">
				
				<strong>Cédula o Rif: {cliente?.customers?.identification}</strong> 
			  </Typography>
			 
			  <Typography variant="body1">
				
				<strong>Direccion: {cliente?.customers?.address}</strong> 
			  </Typography>

			  <Typography variant="body1">
				<strong>Fecha de Registro: {fDateTime(cliente?.customers?.createdAt)}</strong> 
			  </Typography>
			   <Typography variant="body1">
				
				<strong>Total gastado en Tienda: {compra.invoices. totalPurchases}</strong> 
			  </Typography>
			  <hr/>
			  {/* Agrega más datos del cliente según tus necesidades */}
			  <Typography variant="subtitle1">Deudas por Prestamos :</Typography>
          <Typography variant="h4">${debts?.debt}</Typography>
			
			</Box>


			<Typography variant="h5" component="h3">
				Compras Realizadas
			  </Typography>

			  
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
              
              {" "}
              {Array.isArray(compra.invoices.purchases) && compra.invoices.purchases.length  > 0 ? ( compra.invoices.purchases.filter((items) =>
                  items.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((items) => (
                  <TableRow key={items.id}>
                    <TableCell align="left"> {items.invoiceNumber}</TableCell>
                    <TableCell align="left"> {items.date}</TableCell>
                   
                    <TableCell align="left"> {items.amount}</TableCell>
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
            count={compra.invoices.length}
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


export default CustomerPerfil;
