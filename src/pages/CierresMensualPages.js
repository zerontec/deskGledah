
import React, { } from 'react';
import styled from 'styled-components';
import {  Typography,  } from '@mui/material';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import  CierresMensual  from '../sections/@dashboard/CierresMensual/CierresMensual'


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #3f51b5;
  border-radius: 20px;
`



const CierresMensualPages = () => (
    <>

<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
 Generar Inventarios y Cierre Mensual
        </Typography>
        </FormTipo>
<CierresMensual/>


   
<FloatingButtonComponent/>

    </>
  );

export default CierresMensualPages;



