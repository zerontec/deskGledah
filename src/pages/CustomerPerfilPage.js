import React, { useState } from 'react';
import { Grid, Container, Typography,  } from '@mui/material';
import styled from 'styled-components';

import  {CustomerPerfil } from '../sections/@dashboard/CustomerPerfil';
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


const CustomerPerfilPages = () => (
    <>
{/* <FormTipo>
<Typography variant="h4" sx={{ mb: 5 }}>
        Clientes
        </Typography>
        </FormTipo> */}

<FloatingButtonComponent/>

    </>
  );

export default CustomerPerfilPages;



