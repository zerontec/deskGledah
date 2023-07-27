import React from 'react';

import styled from 'styled-components';

import { Typography } from '@mui/material';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { TableAccountPayable } from '../sections/@dashboard/TableAccountPayable';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(0, 123, 255);
  border-radius: 20px;
`;

const AccountPayablePages = () => (
  <>
    <FormTipo>
      <Typography style={{ marginLeft: 15, marginTop: 10 }} color="white" variant="h5" sx={{ marginBottom: 2 }}>
        Cuentas Por Pagar
      </Typography>
    </FormTipo>

    <TableAccountPayable />
    <FloatingButtonComponent />
  </>
);

export default AccountPayablePages;
