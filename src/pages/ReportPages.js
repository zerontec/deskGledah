
import React, { } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {  Button,Typography,Container,  Grid,TextField } from '@mui/material';
import { SearchInvoiceByDate } from '../components/SearchInvoiceByDate';
import { SearchSaleByDate } from '../components/SearchSaleByDate';

import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { SalesReport } from '../components/SalesReport';

const StyledTextField = styled(TextField)`
  && {
    width: 200px;
  }
`;const StyledContainer = styled(Container)`
padding-top: 24px;
padding-bottom: 24px;
`;

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #FF5722;
  border-radius: 20px;
`



const ReportPages = () => (
    <>

<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
        Reportes
        </Typography>
        </FormTipo>



<StyledContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Componente de búsqueda de facturas por rango de fechas */}
          {/* Agrega los campos de entrada y el botón de búsqueda */}
          {/* Usa handleInvoiceSearch para manejar la búsqueda */}
       
<SearchSaleByDate/>
       
       
        </Grid>
        
        <Grid item xs={12} md={6}>
          {/* Componente de búsqueda de ventas por rango de fechas */}
          {/* Agrega los campos de entrada y el botón de búsqueda */}
          {/* Usa handleSalesSearch para manejar la búsqueda */}
          <SalesReport/>
      
      
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Componente para mostrar los resultados de búsqueda de facturas */}
          {/* Muestra los resultados almacenados en invoiceResults */}
          {/* <SearchSaleByDate/> */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Componente para mostrar los resultados de búsqueda de ventas */}
          {/* Muestra los resultados almacenados en salesResults */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Otros botones para acceder a diferentes informes */}
     <Link to='/dashboard/cierres' >    <Button variant="contained">
           Resumen de Cierres
          </Button></Link>
          <Button variant="contained">
            Informe 2
          </Button>
        </Grid>
        {/* Agrega más Grid items para otros subcomponentes de informes */}
      </Grid>
    </StyledContainer>

<FloatingButtonComponent/>
    </>
  );

export default ReportPages;



