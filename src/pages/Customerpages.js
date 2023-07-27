import React, { useState } from 'react';
import { Grid, Container, Typography,  } from '@mui/material';
import styled from 'styled-components';
import { Customer } from '../sections/@dashboard/Customer';
import { BackButton } from '../components/BackButton';
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


const CustomerPages = () => (
    <>
    <FormTipo>
        <Typography style={{ color: 'white', marginLeft: 10 }} variant="h4" gutterBottom>
          Clientes
        </Typography>
      </FormTipo>

<hr/>
<Customer/>

<FloatingButtonComponent/>

    </>
  );

export default CustomerPages;



