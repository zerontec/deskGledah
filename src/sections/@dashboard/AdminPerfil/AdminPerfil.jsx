/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from '@mui/material/Modal';
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
  TextField,
  Button,
  Alert,
} from '@mui/material';
import Swal from 'sweetalert2';
import { DriveFolderUpload } from '@mui/icons-material';
import { serachUsereById } from '../../../redux/modules/user';
import {  deleteUpload, getAllLoans,  updateLoand } from '../../../redux/modules/loan';

import { fDate, fDateTime } from '../../../utils/formatTime';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';
import { CreateLoan } from '../../../components/CreateLoan';
import { CreateSeller } from '../../../components/CreateSeller';
import { PaymentTable } from '../../../components/PaymentTable';

const columns = [
  {
    id: 'id',
    label: 'Id Deuda',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Codigo vendedor',
    minWidth: 100,
  },
  {
    id: 'name',
    label: 'Nombre',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Monto Actual',
    minWidth: 50,
  },
  {
    id: 'fecha',
    label: 'status',
    minWidth: 50,
  },
  {
    id: 'notes',
    label: 'Fecha',
    minWidth: 50,
  },
  {
    id: 'notes',
    label: 'Motivo',
    minWidth: 50,
  },
];

const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;
const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
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

const AdminPerfil = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  

 

 

  // Clientes




  const [selectedLoanEdit, setSelectedLoanEdit] = useState({
    amount: '',
    nota: '',
    status: '',
  });


  const usuarios = useSelector((state) => state.usuarios);
  const deuda = useSelector((state) => state.loan);

  console.log('usuarios', usuarios);
  console.log('deuda', deuda);



  useEffect(() => {
    dispatch(serachUsereById({ id }))
      .then((response) => setUser(response)
      
      )
      .catch((error) => console.log(error));

  

    
      // .then((response) => setDeudas(response))
      // .catch((error) => console.log(error));
  }, [id, dispatch]);


  fDateTime();

  const [formInfo, setFormInfo] = useState({
    amount: '',
    paymentDate: '',
  });


  return (
    <>
   
      {/* Modal Abono  */}

      <StyledContainer>
        {/* {customer && ( */}
        <>
          <Box sx={{ marginBottom: '24px' }}>
            <Typography variant="h4" component="h1">
              PERFIL
            </Typography>
            <Typography variant="body1">
              <strong>Nombre: {usuarios?.usuarios?.name}</strong>
            </Typography>
            <Typography variant="body1">
              <strong>Username: {usuarios?.usuarios?.username}</strong>
            </Typography>

            <Typography variant="body1">
              <strong>Direccion: {usuarios?.usuarios?.email}</strong>
            </Typography>

            <Typography variant="body1">
              <strong>Fecha de Registro: {fDateTime(usuarios?.usuarios?.createdAt)}</strong>
            </Typography>
            {/* <Typography variant="body1">
     <hr/>
     <strong>Total gastado: {compra.invoices. totalPurchases}</strong>
   </Typography> */}
            {/* Agrega más datos del cliente según tus necesidades */}
            
            
            <hr/>
      

          </Box>
         
        
        

          <FloatingButtonComponent />
        </>
        {/* // )} */}
      </StyledContainer>
    </>
  );
};

export default AdminPerfil;
