import React,{useState} from 'react';
import styled from 'styled-components';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { Document, Page, pdfjs } from '@react-pdf/renderer';
import numeral from 'numeral';

import Modal from '@mui/material/Modal';

import authHeader from '../../redux/services/auth-header';

import { fDateTime } from '../../utils/formatTime';
import { getAllPaymentCustomer } from '../../redux/modules/paymentCustomer';





const ViewAbonoCustomer = ({loanId}) => {

	const API_URL_D = 'http://localhost:5040/';
	const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';
  

	const [selectedCuenta, setSelectedCuenta] = useState(null);

	const formatAmountB = (amount) => numeral(amount).format('0,0.00');
  
	const { message } = useSelector((state) => state);
	console.log('mensaje', message);
  
	const [selectedCuentaPagos, setSelectedCuentaPagos] = useState([]);
  
	const handleVerPagos = async (loanId) => {
	  try {
		const response = await axios.post(`${API_URL_D}api/loanCustomer/get-payments`,{loanId}, { headers: authHeader() });
		setSelectedCuentaPagos(response.data);
		setSelectedCuenta(loanId);
	  } catch (error) {
		console.error(error);
	  }
	};
  
	console.log('cpmpraId', loanId);
	console.log('handleVerPagos d', handleVerPagos);
  




	return (
<>

		<TableCell className="tableCell">
        <Button variant="contained" style={{backgroundColor:"green"}} onClick={() => handleVerPagos(loanId)}>
           Abonos
        </Button>
      </TableCell>

      <Modal open={selectedCuenta !== null} onClose={() => setSelectedCuenta(null)}>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  {/* <TableCell>Cliente</TableCell> */}
                  <TableCell>Id Cliente</TableCell>
                  <TableCell>Monto Pagado</TableCell>
				  <TableCell>Fecha de Pago</TableCell>
				  {/* Agrega más columnas según la información que desees mostrar */}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCuentaPagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>{pago.id}</TableCell>
                    {/* <TableCell>{pago.customer}</TableCell> */}
                    <TableCell>{pago.customerId}</TableCell>
					<TableCell>{formatAmountB(pago.amount)}</TableCell>
					<TableCell>{fDateTime(pago.createdAt)}</TableCell>
                    {/* Agrega más celdas según la información que desees mostrar */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={() => setSelectedCuenta(null)}>
            Cerrar
          </Button>
        </Box>
      </Modal>
</>


	)
};


ViewAbonoCustomer.propTypes = {};

export default ViewAbonoCustomer;