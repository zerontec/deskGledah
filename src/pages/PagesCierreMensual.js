
import React, { } from 'react';
import styled from 'styled-components';
import {  Typography,  } from '@mui/material';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { GenerateCierreMensual } from '../components/GenerateCierreMensual';


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #3f51b5;
  border-radius: 20px;
`



const PagesCierreMensual = () => (
    <>

<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
  Cierre Mensual
        </Typography>
        </FormTipo>

<GenerateCierreMensual/>

   
<FloatingButtonComponent/>

    </>
  );

export default PagesCierreMensual;



