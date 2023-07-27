/* eslint-disable arrow-body-style */
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Link , useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FloatingButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  background-color: #FF4081;
  color: #FFF;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #FF80AB;
  }
`;

const FloatingButtonIcon = styled(ArrowBackIcon)`
  color: inherit;
`;

const FloatingButtonComponent = ({ to }) => {

	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1); // Navegar hacia atrás
	  };
	
	return (
    <FloatingButton to={to} onClick={goBack}>
      <FloatingButtonIcon />
    </FloatingButton>
  );
};

export default FloatingButtonComponent;
