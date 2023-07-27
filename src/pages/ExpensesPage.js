import React from 'react'
import styled from 'styled-components';
import {
  
    Typography,
  
  } from '@mui/material';



import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { TableExpenses } from '../sections/@dashboard/TableExpenses';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(255, 87, 34);
  border-radius: 20px;
`;




const ExpensesPages =() => (

<>

<FormTipo>
        <Typography style={{ color: 'white', marginLeft: 10 }} variant="h4" gutterBottom>
         Gastos 
        </Typography>
      </FormTipo>

<hr/>

<TableExpenses/>

<FloatingButtonComponent/>
</>


)


export default ExpensesPages