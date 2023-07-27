
import React, { useState } from 'react';

import styled from 'styled-components';

import { Grid, Container, Typography,  } from '@mui/material';
import { CuentasPorCobrar } from '../sections/@dashboard/CuentasPorCobrar';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(0, 123, 255);
  border-radius: 20px;
`


const CuentasxPages = () => (
    <>

<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
         Cuentas Por Cobrar
        </Typography>
        </FormTipo>


<CuentasPorCobrar/>

   <FloatingButtonComponent/>
    </>
  );

export default CuentasxPages;



