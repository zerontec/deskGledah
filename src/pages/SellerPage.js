import React from 'react'
import styled from 'styled-components';
import {
  
    Typography,
  
  } from '@mui/material';

import { Seller } from '../sections/@dashboard/Seller'
import { BackButton } from '../components/BackButton';
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(255, 87, 34);
  border-radius: 20px;
`;




const SellerPage =() => (

<>

<FormTipo>
        <Typography style={{ color: 'white', marginLeft: 10 }} variant="h4" gutterBottom>
          Vendedores
        </Typography>
      </FormTipo>

<hr/>

<Seller/>

<FloatingButtonComponent/>
</>


)


export default SellerPage