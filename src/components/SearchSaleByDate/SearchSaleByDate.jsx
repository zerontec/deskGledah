import React, {useState} from 'react';
import axios from 'axios';

import styled from 'styled-components';

import Swal from 'sweetalert2';
import { Button, Typography, Container,  TextField , Snackbar} from '@mui/material';

import authHeader from '../../redux/services/auth-header';

const API_URL_D = "http://localhost:5040/";
const API_URL = "https://expressjs-postgres-production-bd69.up.railway.app/"

const FormContainer = styled.form `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const StyledTextField = styled(TextField)`
  && {
    width: 200px;
  }
`;
const SearchButton = styled(Button)`
  && {
    width: 100px;
    height: 40px;
    background-color: #6200ee;
    color: white;

    &:hover {
      background-color: #3700b3;
    }
  }
`;


const SearchSaleByDate = () => {
	const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  	const[resp, setResp] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


  
	
	
	
    const handleSubmit = async (event) => {
		event.preventDefault();
	
		try {
		  if (!startDate || !endDate) {
			setErrorMessage("Por favor, ingresa ambas fechas.");
			return;
		  }
	
		  const data = {
			// eslint-disable-next-line object-shorthand
			startDate: startDate,
			// eslint-disable-next-line object-shorthand
			endDate: endDate,
			// page: currentPage, // Agrega el número de página actual
			// pageSize: 10, // Puedes ajustar el tamaño de página aquí
		  };
	
		  console.log(startDate,endDate);
		  
		  try {
			const response = await axios.get(`${API_URL_D}api/report/daily-report/${startDate}/${endDate}`,{ headers: authHeader() } );
	
			if (response) {
			  setSuccessMessage("Venta para la fecha");
			  setResp(response.data.totalSales)
			  // setCurrentPage(1);
			   // Restablecer la página actual al realizar una nueva búsqueda
			} else if (response.error) {
			  setErrorMessage(response.error);
			}
  
			console.log("response",response)
		   
		  } catch (error) {
        if (error.response && error.response.status === 404) {
          const errorMessage = error.response.data.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        } else {
          console.error('Error al generar el resumen del cierre de ventas:', error);
        }
			setErrorMessage(error.message);
		  }

		} catch (error) {
		  setErrorMessage(error.message);
		}
	  };
	
	  console.log(currentPage)

	return (

<>

	
<Container>

<Typography variant="p" component="p" >
        Búsqueda Total Ventas  por  Fechas
      </Typography>
          <FormContainer onSubmit={handleSubmit}>
            <StyledTextField
              id="startDate"
              label="Fecha de inicio"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <StyledTextField
              id="endDate"
              label="Fecha de fin"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <SearchButton variant="contained" type="submit">
              Buscar
            </SearchButton>
          </FormContainer>
		  <Typography variant="h4" component="h1" >
Total Ventas $ {resp}
      </Typography>

          <Snackbar
            open={!!errorMessage || !!successMessage}
            autoHideDuration={3000}
            onClose={() => {
              setErrorMessage("");
              setSuccessMessage("");
            }}
            message={errorMessage || successMessage}
          />
        </Container>
  
				
</>

	)


}

export const SearchSaleByDateStyle = styled.div``;

export default SearchSaleByDate;
