import React from 'react';
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
  import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { CreateLoan } from '../components/CreateLoan';
import { CreateSeller } from '../components/CreateSeller';
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #FF5722;
  border-radius: 20px;
`


const LoanPages= ()=>(

    <>
<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
        Administracion Prestamos 
        </Typography>
        </FormTipo>



    <Box display="flex" justifyContent="space-between" marginRight={20} marginBottom={2}>
       
       <Link to="/dashboard/prestamos-cliente">
   <Button variant="contained">Ir Administracio Prestamos Cliente</Button>
   </Link>

   <Link to="/dashboard/prestamos-empleados">
   <Button variant="contained">Ir Administracio Prestamos Empleados</Button>
   </Link>

   <CreateSeller  />
   
 
  
 </Box>

 <FloatingButtonComponent/>
    </>

)


export default LoanPages;