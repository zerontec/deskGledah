import styled from 'styled-components';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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

const ModuleLinks = () => {
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    navigate(link);
    console.log(`Redireccionando a ${link}`);
  };

  return (
    <LinkBoxContainer>
      <LinkBox style={{ backgroundColor: '#007bff' }} onClick={() => handleLinkClick('/dashboard/invoice')}>
        <LinkText>Ventas</LinkText>
      </LinkBox>

      <LinkBox style={{ backgroundColor: '#ff6b6b' }} onClick={() => handleLinkClick('/dashboard/compras')}>
        <LinkText>Compras</LinkText>
      </LinkBox>

      <LinkBox style={{ backgroundColor: '#00cc99' }} onClick={() => handleLinkClick('/dashboard/submodule')}>
        <LinkText>Usuarios De Sistema</LinkText>
      </LinkBox>

      <LinkBox style={{ backgroundColor: '#FF5722' }} onClick={() => handleLinkClick('/dashboard/inventario')}>
        <LinkText>Inventario</LinkText>
      </LinkBox>

      <LinkBox style={{ backgroundColor: '#ff8c00' }} onClick={() => handleLinkClick('/dashboard/reportes')}>
        <LinkText>Reportes</LinkText>
      </LinkBox>
    </LinkBoxContainer>
  );
};

export default ModuleLinks;
