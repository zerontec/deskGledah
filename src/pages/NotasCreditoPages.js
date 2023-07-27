
import React, { } from 'react';
import styled from 'styled-components';
import {  Typography,  } from '@mui/material';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { NotasCredito } from '../sections/@dashboard/NotasCredito';


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #FF5722;
  border-radius: 20px;
`



const NotasCreditoPages = () => (
    <>

<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
          Notas de Credito
        </Typography>
        </FormTipo>



<NotasCredito/>
   
   <FloatingButtonComponent/>
    </>
  );

export default NotasCreditoPages;



