
import React from 'react';
import {  Typography,  } from '@mui/material';
import styled from 'styled-components';

import InvoiceTable from '../sections/@dashboard/Invoicetable/Invoicetable';
import { ButtonBar } from '../components/ButtonBar';
import { CreateDevolucion } from '../components/CreateDevolucion';
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


const InvoicePages = () => (
    <>


<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
         Lista de facturas
        </Typography>
        </FormTipo>


        <CreateDevolucion/>
<ButtonBar 
button1={"Cuentas Por Cobrar"}
button1Link={'/dashboard/cuentasxc'}

button3={"Devoluciones en Venta"}
button3Link={'/dashboard/devoluciones-venta'}
button2={"Clientes"}
button2Link={'/dashboard/clientes'}

button4={"Vendedores"}
button4Link={'/dashboard/vendedores'}
                     
/>

        <InvoiceTable/>

   <FloatingButtonComponent/>
    </>
  );

export default InvoicePages;



