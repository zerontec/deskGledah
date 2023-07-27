import React from 'react';
import styled from 'styled-components';
import {  Typography,  } from '@mui/material';

import { ProductD } from '../sections/@dashboard/ProductD';
import { BackButton } from '../components/BackButton';
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #E91E63;
  border-radius: 20px;
`


const ProductDPages = () => (
    <>


<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
          Inventario de productos Defectuosos
        </Typography>
        </FormTipo>


    <ProductD/>

    <FloatingButtonComponent/>
   
    </>
  );

export default ProductDPages;

