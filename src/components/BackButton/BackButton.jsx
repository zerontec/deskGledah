import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navegar hacia atrás
  };

  return (
    <StyledButton onClick={goBack}>
         <ArrowBackIcon style={{color:'black'}} />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background-color: #2065D1;
  color:'white';
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  i {
    color: #333;
    font-size: 24px;
  }
`;

export default BackButton;