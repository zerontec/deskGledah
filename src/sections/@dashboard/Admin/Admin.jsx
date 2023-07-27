import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';

// Estilos personalizados
const AdminContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background-color: #FFFFFF;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const Admin = () => (
  <>
    <AdminContainer>
      <Typography variant="h4" color="primary" sx={{ marginBottom: '2rem' }}>
        Panel de Administración
      </Typography>

      <ButtonContainer>
        <Button variant="contained" component={Link} to="/compras" color="primary">
          Compras
        </Button>
        <Button variant="contained" component={Link} to="/facturacion" color="primary">
          Facturación
        </Button>
        {/* Agrega más botones para otras funcionalidades de administración */}
      </ButtonContainer>
    </AdminContainer>
<FloatingButtonComponent/>
</>
  );

export default Admin;
