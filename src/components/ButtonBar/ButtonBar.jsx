import React from 'react';
import { Button, Box } from '@mui/material';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #007bff;
    color: #ffffff;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

// eslint-disable-next-line arrow-body-style
const ButtonBar = ({button1, button1Link, button2, button2Link, button3, button3Link,button4, button4Link }) => {
  return (
    <Box display="flex" justifyContent="center">
      <ButtonContainer>
 
  <Link to={button1Link} >   
  <StyledButton variant="contained" >
        {  button1}
        </StyledButton></Link> 

 

        <Link to={button3Link} >     <StyledButton variant="contained" href="/enlace3">
         {button3}
        </StyledButton></Link>


        <Link to={button2Link} > <StyledButton variant="contained" href="/enlace2">
         
         {button2}
       </StyledButton> </Link>
        <Link to={button4Link} >     <StyledButton variant="contained" href="/enlace4">
         {button4}
        </StyledButton></Link>
        {/* <StyledButton variant="contained" href="/enlace4">
          Reportes
        </StyledButton> */}
      </ButtonContainer>
    </Box>
  );
};

export default ButtonBar;
