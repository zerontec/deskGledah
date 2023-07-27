/**
 * The above code is a React component that renders a form to create a new "Abono" (payment) for a
 * purchase.
 * @returns The component is returning a JSX structure that includes a button and a modal. The button
 * is used to open the modal, and the modal contains a form for creating a new "Abono" (payment) with
 * various input fields such as "proveedor" (supplier), "montoPagado" (amount paid), and "fechaPago"
 * (payment date). The form also includes validation for the input
 */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { Button, TextField, Alert } from '@mui/material';

import { createAbonocxp } from '../../redux/modules/accountPayables';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  & > * {
    margin-bottom: 8px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const CreateAbonocxp = ({ compraId }) => {
  const [selectButton, setSelectButton] = useState(null);
  const [messageError, setMessageError] = useState({});
  const [loading, setLoading] = useState(false);
  const [cuentaData, setCuentaData] = useState({
    proveedor: '',
    montoPagado: '',
    fechaPago: '',
  });

  const formatAmountB = (amount) => numeral(amount).format('0,0.00');

  const [errors, setErrors] = useState({});

  const { message } = useSelector((state) => state);
  console.log('mensaje', message);

  const [formInfo, setFormInfo] = useState({
    proveedor: '',
    montoPagado: '',
    fechaPago: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const { proveedor, montoPagado, fechaPago } = formInfo;
    setIsFormValid(proveedor.trim() !== '' && montoPagado.trim() !== '' && fechaPago.trim() !== '');
  };

  useEffect(() => {
    validateForm();
  }, [formInfo]);

  function validate(formInfo) {
    const errors = {};
    formInfo.proveedor ? (errors.proveedor = '') : (errors.proveedor = 'Ingrese proveedor ');
    formInfo.montoPagado ? (errors.montoPagado = '') : (errors.montoPagado = 'Ingrese Monto');
    formInfo.fechaPago ? (errors.fechaPago = '') : (errors.fechaPago = 'Ingrese una Fecha');

    return errors;
  }

  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevFormInfo) => ({
      ...prevFormInfo,
      [name]: value,
    }));
    setErrors(validate({ ...formInfo, [name]: value }));

  
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const montoPagadoNumber = parseFloat(formInfo.montoPagado); // Convertir a número
    const data = {
      proveedor: formInfo.proveedor,
      montoPagado: montoPagadoNumber,
      fechaPago: formInfo.fechaPago,
      compraId,
    };

    setLoading(true);
    dispatch(createAbonocxp(data))
      .then((response) => {
        setLoading(false);
        Swal.fire('Abono a cuenta creado con éxito!', '', 'success');
        window.location.reload();
        setFormInfo({
          proveedor: '',
          montoPagado: '',
          fechaPago: '',
        });
        setSelectButton(null);
        if (response.error) {
          setMessageError(response.error);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Swal.fire({
          icon: 'error',

          title: 'Error',
          text: errorMessage,
          });
          setFormInfo({
            proveedor: '',
            montoPagado: '',
            fechaPago: '',
          });
          setSelectButton(null);
         
        } else {
          console.error('Error al generar a intentar agregar abono:', error);
        }
        });
  };



  return (
    <>
      <hr />
      <Button variant="contained" onClick={() => setSelectButton()}>
        Agregar Abono
      </Button>

      <Modal open={selectButton !== null} onClose={() => setSelectButton(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Aquí va el contenido del modal */}
          <form onSubmit={handleSubmit}>
            <FormContainer>
              <FieldContainer>
                <TextField
                  required
                  label="Compra Id"
                  name="compraId"
                  type="text"
                  id="compraId"
                  value={compraId}
                  onChange={handleChange}
                />
                <TextField
                  required
                  label="proveedor"
                  name="proveedor"
                  type="text"
                  id="proveedor"
                  value={formInfo.proveedor}
                  onChange={handleChange}
                />{' '}
                {errors.proveedor && <span className="error-message"> {errors.proveedor}</span>}
                <TextField
                  required
                  label="Cantidad "
                  name="montoPagado"
                  type="number"
                  id="montoPagado"
                  value={formInfo.montoPagado}
                  onChange={handleChange}
                />{' '}
                {errors.montoPagado && <span className="error-message"> {errors.montoPagado}</span>}
                <TextField
                  required
                  label="Fecha "
                  type="date"
                  name="fechaPago"
                  id="fechaPago"
                  value={formInfo.fechaPago}
                  onChange={handleChange}
                />{' '}
                {errors.fechaPago && <span className="error-message"> {errors.fechaPago}</span>}
                {message && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {' '}
                    {messageError}{' '}
                  </Alert>
                )}{' '}
              </FieldContainer>
              <ActionsContainer>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
                >
                  {loading ? 'Cargando...' : 'Agregar Abono '}
                </Button>
              </ActionsContainer>
            </FormContainer>
          </form>
          <hr />
          <Button variant="contained" onClick={() => setSelectButton(null)}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default CreateAbonocxp;
