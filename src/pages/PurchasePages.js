import React from 'react';
import styled from 'styled-components';

import {Typography, Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';



const LinkBoxContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap; /* Agrega la propiedad flex-wrap para que los elementos se envuelvan */
`;

const LinkBox = styled(Box)`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LinkText = styled.span`
  font-size: 16px;
  font-weight: bold;
`;


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(255, 107, 107);
  border-radius: 20px;
`


const PurchasePage = () => {





	const handleLinkClick = (link) => {
	  navigate(link);
	  console.log(`Redireccionando a ${link}`);
	}

	const navigate = useNavigate();
  
return(
    <>
    <FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
        Modulo Compras
        </Typography>
        </FormTipo>


        <LinkBoxContainer>
  

  <LinkBox style={{ backgroundColor: '#00cc99' }} onClick={() => handleLinkClick('/dashboard/cargar-compras')}>
	<LinkText>Cargar Compras</LinkText>
  </LinkBox>

  <LinkBox style={{ backgroundColor: '#FF5722' }} onClick={() => handleLinkClick('/dashboard/lista-compras')}>
	<LinkText>Lista de Compras</LinkText>
  </LinkBox>

  <LinkBox style={{ backgroundColor: '#FF5722' }} onClick={() => handleLinkClick('/dashboard/lista-proveedores')}>
	<LinkText>Lista de Proveedores</LinkText>
  </LinkBox>

  <LinkBox style={{ backgroundColor: '#FF5722' }} onClick={() => handleLinkClick('/dashboard/cuentasxp')}>
	<LinkText>Compras por Pagar </LinkText>
  </LinkBox>


 
</LinkBoxContainer>

<FloatingButtonComponent/>
  {/* <Purchases/> */}
   
    </>
  );
}
export default PurchasePage;



