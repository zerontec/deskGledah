/* eslint-disable arrow-body-style */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { fetchCustomers } from '../../redux/modules/customer';
import { fetchSellers } from '../../redux/modules/seller';
import { ErrorMessage } from '../ErrorMessage';

const SummaryContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 40px;

  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  font-weight: 600;
  background-color: #ff8000;
  margin-bottom: 10px;
  margin-top: 30px;
  /* margin-right: 20px; */
  font-family: 'DIGIT-LCD';
  background-image: linear-gradient(to bottom, #ff8000, #ffbf00);
`;

const SummaryContainerP = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  font-weight: 600;
  background-color: #27ae60;
  margin-bottom: 10px;
  margin-top: 30px;
  margin-right: 20px;

  & > * {
    margin-right: 10px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #212f3d;
  border-radius: 30px;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: right;
  margin-top: 20;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-top: 10px;
    color: #ffffff;
    text-align: center;

    input {
      text-align: center;

      color: #919eab;
    }
  }
`;

const SearchCustomer = ({
  nformattedValue,
  setSelectedCustomer,
  setSelectedSeller,
  manualClientData,
  setManualClientData,
  seller,
  setSeller,
  subtotal,
  resetFormD,
  invoiceSent,
}) => {
  const [query, setQuery] = useState('');
  const [client, setClient] = useState({});
  const [searchError, setSearchError] = useState(false);
  const [querys, setQuerys] = useState('');

  const [currency, setCurrency] = useState('Bs');
  const [currencys, setCurrencys] = useState('$');

  const availableSeller = useSelector((state) => state.vendedores.vendedores);
  const customers = useSelector((state) => state.customer);

  const dispatch = useDispatch();

  const formatAmountB = (amount) => numeral(amount).format('0,0.00');

  const showAlert = () => {
    Swal.fire({
      title: '¡Alerta!',
      text: 'Ingrese Datos de cliente  !',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  };

  console.log('Numericvalue en Customer', nformattedValue);

  // console.log('subt total en customer');

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleManualSelect = (customer) => {
    setManualClientData(customer);
  };

  const handleSellerSelect = (seller) => {
    setSelectedSeller(seller);
  };

  const handleSearchClient = () => {
    if (customers && Array.isArray(customers.customers)) {
      const exactMatch = customers.customers.find((customer) => customer.identification === query);

      if (exactMatch) {
        setClient(exactMatch);
        handleCustomerSelect(exactMatch);
        handleManualSelect(manualClientData);
      }
      setSearchError(true);
    }
    // if (!customers) {
    //   showAlert();
    //   // Aquí puedes manejar el caso en el que customers o customers.customers no estén definidas
    //   // Puedes establecer un valor predeterminado o mostrar un mensaje de error
    // }
  };

  const handleSearchSeller = () => {
    if (Array.isArray(availableSeller)) {
      const exactMatch = availableSeller.find((seller) => seller.identification === querys || seller.codigo === querys);

      if (exactMatch) {
        setSeller(exactMatch);
        handleSellerSelect(exactMatch);
      }
      setSearchError(true);
    }
  };

  const resetForm = () => {
    setClient('');
    setSeller('');

    setManualClientData('');
    setQuerys('');
  };

  useEffect(() => {
    if (query) {
      dispatch(fetchCustomers(query));
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (querys) {
      dispatch(fetchSellers(querys));
    }
  }, [querys, dispatch]);


  useEffect(() => {
    console.log('Efecto invoiceSent activado');
    // Este efecto se ejecutará cuando el valor de invoiceSent cambie
    if (invoiceSent) {
      setClient('')
      resetFormD();
 
    }
  }, [invoiceSent, resetFormD]);



  // SearchCustomer.propTypes = {
  //   manualClientData: PropTypes.shape({
  //     identification: PropTypes.string.isRequired,
  //     address: PropTypes.string.isRequired,
  //     name: PropTypes.string.isRequired,
  //   }).isRequired,
  //   setManualClientData: PropTypes.func.isRequired,
  //   // seller: PropTypes.object.isRequired,
  //   // setSeller: PropTypes.func.isRequired,
  //   subtotal: PropTypes.number.isRequired,
  //   // handleCustomerSelect: PropTypes.func.isRequired,
  //   // Asegúrate de agregar la validación para selectedCustomer

  //   selectedSeller: PropTypes.shape({
  //     identification: PropTypes.string.isRequired,
  //     codigo: PropTypes.string.isRequired,
  //     name: PropTypes.string.isRequired,
  //   }),

  //   selectedCustomer: PropTypes.shape({
  //     identification: PropTypes.string.isRequired,
  //     name: PropTypes.string.isRequired,
  //     address: PropTypes.string.isRequired,
  //   }),
  // };

  // console.log('manual client data', manualClientData);

  const subtotalB = subtotal / 1.16;
  const resultSubB = subtotalB;
  const iva = subtotal - resultSubB;
  const TotalF = resultSubB + iva;

  const totalB = TotalF * parseFloat(nformattedValue);

  return (
    <>
      <FormContainer>
        {/* Formulario de búsqueda y agregar cliente */}
        <Grid container spacing={2} sx={{ marginBottom: 2, marginTop: '20px', marginLeft: '10px' }}>
          <Grid item xs={12} md={3}>
            <StyledTextField
              label="Buscar Cliente"
              variant="outlined"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={handleSearchClient}
            />
            <div style={{ color: 'white' }}>
              <ErrorMessage message={customers.customers.message} show={searchError} />
            </div>
            <StyledTextField
              style={{ marginTop: 10 }}
              label="Agregar Vendedor"
              variant="outlined"
              value={querys}
              onChange={(event) => setQuerys(event.target.value)}
              onBlur={handleSearchSeller}
            />
            <div style={{ color: 'white' }}>
              <ErrorMessage message={availableSeller.message} show={searchError} />
            </div>
            <StyledTextField
              label="Nombre vendedor"
              variant="outlined"
              sx={{ marginBottom: 2 }}
              value={seller.name || ''}
              disabled
              style={{ marginTop: 10 }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '20px',
            }}
          >
            <StyledTextField
              label="Nombre"
              variant="outlined"
              sx={{
                marginBottom: 2,
                marginRight: 20,
              }}
              value={client.name || manualClientData.name || ''}
              onChange={(event) =>
                setManualClientData({
                  ...manualClientData,
                  name: event.target.value,
                })
              }
            />
            <StyledTextField
              label="Identificación"
              variant="outlined"
              sx={{
                marginBottom: 2,
                marginRight: 20,
              }}
              value={client.identification || manualClientData.identification || ''}
              onChange={(event) =>
                setManualClientData({
                  ...manualClientData,
                  identification: event.target.value,
                })
              }
            />
            <StyledTextField
              label="Dirección"
              variant="outlined"
              sx={{
                marginBottom: 2,
                marginRight: 20,
              }}
              value={client.address || manualClientData.address || ''}
              onChange={(event) =>
                setManualClientData({
                  ...manualClientData,
                  address: event.target.value,
                })
              }
            />

            <Button onClick={resetForm}>Limpiar Form Cliente</Button>
          </Grid>

          <Box>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} md={12}>
                <SummaryContainer>
                  <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>
                    Subtotal: {resultSubB.toFixed(2)}
                  </Typography>
                  <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>Iva(16%): {iva.toFixed(2)}</Typography>
                  <Typography style={{ fontFamily: 'DIGIT-LCD', fontSize: 20 }}>
                    Total: {currencys} {TotalF.toFixed(2)}
                  </Typography>
                  <Typography>
                    Total: {currency} {formatAmountB(totalB)}
                  </Typography>
                </SummaryContainer>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </FormContainer>
    </>
  );
};

export default SearchCustomer;
