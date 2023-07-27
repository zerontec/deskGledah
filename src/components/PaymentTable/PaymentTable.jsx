import React, {useState, useEffect} from 'react';

import styled from 'styled-components';
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useDispatch, useSelector } from "react-redux";

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
	Typography
  
  } from '@mui/material';
  import { fDate, fDateTime } from '../../utils/formatTime';

  import { getAllPayment } from '../../redux/modules/payments';



  const columns = [
	{
		id: "id",
		label: "Id de Deuda",
		minWidth: 50,
	  },
	{
	  id: "id",
	  label: "Monto Abonado",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Fecha de Abono",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Empleado",
	  minWidth: 50,
	},
	{
	  id: "gender",
	  label: "Codigo Empleado",
	  minWidth: 50,
	},
	// {
	//   id: "address",
	//   label: "Afectada por Devolucion",
	//   minWidth: 150,
	// },
  ];

const PaymentTable = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAbono, setSelectedAbono] = useState(null);
	const dispatch = useDispatch();
	const [abono, setAbono]=useState([])


fDateTime();


const abonos = useSelector((state)=> state.payment)
console.log("abonos", abonos)



useEffect(() => {
	dispatch(getAllPayment())
	  .then((response) => {
		if (Array.isArray(response)) {
		  setAbono(response);
		} else {
		  setAbono([]);
		}
	  })
	  .catch((error) => console.log(error));
  }, []);


const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


	return(
		<>
		
<Box sx={{ m: 2 }}>

  
<Typography variant="h5" component="h3">
            Abonos Realizados
          </Typography>
		  
  
<TextField
          label="Buscar Abonos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
       
  
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
              {Array.isArray(abonos?.payments) && abonos?.payments.length > 0 ? (
        abonos?.payments
          .filter((item) =>
            item.seller?.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item) => (
            
              <TableRow key={item.id} >
				<TableCell align="left">{item.loanId}</TableCell>
                <TableCell align="left">{item.amount}</TableCell>
                 <TableCell align="left">{fDateTime(item.createdAt)}</TableCell> 
                <TableCell align="left">{item.seller?.name}</TableCell>
				<TableCell align="left">{item.seller?.codigo}</TableCell>
               
               
                {/* ... */}
                <>
                      {/* <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedAbono(item)}
                        >
                          Ver
                        </Button>
                      </TableCell> */}
                      
                    </>
              </TableRow>

              
            )
          )
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
			count={Array.isArray(abonos?.payments) ? abonos.payments.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
           />
        </TableContainer>
      </Box>
		
		
		
		</>


	);
};

export const PaymentTableStl = styled.div``;

PaymentTable.propTypes = {};

export default PaymentTable;