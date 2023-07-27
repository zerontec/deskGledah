import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import validator from 'validator';
import { Button, TextField, Alert } from '@mui/material';
import { createDevolution } from '../../redux/modules/devolucionV';

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

const CreateDevolucion = () => {
  const [selectButton, setSelectButton] = useState(null);
  const [messageError, setMessageError] = useState({});
  const [loading, setLoading] = useState(false);
  const [devolutionData, setDevolutionData] = useState({
    
    invoiceNumber: '',
    motivo: '',
    productos: [],
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { message } = useSelector((state) => state);
  console.log('mensaje', message);

//   const [productList, setProductList] = useState([]);

  //   const handleProductChange = (index, event) => {
  //     const { name, value } = event.target;
  //     const updatedProductList = [...productList];
  //     updatedProductList[index][name] = value;
  //     setProductList(updatedProductList);
  //   };

  const handleProductChange = (index, field, value) => {
    setDevolutionData((prevData) => {
      const newProducts = [...prevData.productos];
      newProducts[index][field] = value;
      return { ...prevData, productos: newProducts };
    });
  };

  const addProduct = () => {
    setDevolutionData((prevData) => ({
      ...prevData,
      productos: [...prevData.productos, {barcode: '', quantity: '' }],
    }));
  };
  const removeProduct = (index) => {
    setDevolutionData((prevData) => {
      const newProducts = [...prevData.productos];
      newProducts.splice(index, 1);
      return { ...prevData, productos: newProducts };
    });
  };

  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDevolutionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    // Validar el campo de numero de factura
    if (validator.isEmpty(devolutionData.invoiceNumber)) {
      errors.rif = 'ElNumero de factura es requerido .';
    }

    // Validar el campo motivo
    if (validator.isEmpty(devolutionData.motivo)) {
      errors.address = 'Agregue un Motivo de Devolucion.';
    }

    // Retornar los errores encontrados
    return errors;
  };

  const handleSubmitDevolution = (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Si hay errores de validación, actualizar el estado de los errores y detener la creación del proveedor
      setValidationErrors(errors);
      return;
    }
    setLoading(true);

    dispatch(createDevolution(devolutionData))
      .then((response) => {
        setLoading(false);
        Swal.fire('Devolucion creada con éxito!', '', 'success');
        setDevolutionData({
          invoiceNumber: '',
          motivo: '',
          productos: [],
        });

        setSelectButton(null);
        if (response.error) {
          setMessageError(response.error);
        }
        setValidationErrors({});
      })

      .catch((error) => {
        console.log(error);
        setLoading(false);
        setSelectButton(null);
        setMessageError(error.message);
        Swal.fire(error.message);
      });
    // Limpia el formulario después de la creación exitosa del proveedor
  };

  return (
    <>
      <hr />
      <Button variant="contained" onClick={() => setSelectButton()}>
          Crear Devolucion
        </Button>
      <Modal open={selectButton !== null} onClose={() => setSelectButton(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Aquí va el contenido del modal */}
          <form onSubmit={handleSubmitDevolution}>
            <FormContainer>
              <FieldContainer>
                <TextField
                  required
                  label="Numero de factura "
                  name="invoiceNumber"
                  type="text"
                  id="invoiceNumber"
                  value={devolutionData.invoiceNumber}
                  onChange={handleInputChange}
                />{' '}
                {validationErrors.invoiceNumber && <span>{validationErrors.invoiceNumber}</span>}
                <TextField
                  required
                  label="Motivo"
                  name="motivo"
                  type="text"
                  id="motivo"
                  value={devolutionData.motivo}
                  onChange={handleInputChange}
                />{' '}
                {validationErrors.motivo && <span>{validationErrors.motivo}</span>}
                {devolutionData.productos.map((product, index) => (
                  <div key={index}>
                    <TextField
                      label="Código de barras"
                      name={`barcode-${index}`}
                      value={product.barcode}
                      onChange={(event) => handleProductChange(index, 'barcode', event.target.value)}
                    />
                    <TextField
                      label="Cantidad"
                      name={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(event) => handleProductChange(index, 'quantity', event.target.value)}
                    />


                    <Button onClick={() => removeProduct(index)}>Quitar Producto</Button>
                  </div>
                ))}
                <Button onClick={addProduct}>Agregar Producto</Button>
                {message && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {' '}
                    {messageError}{' '}
                  </Alert>
                )}{' '}
              </FieldContainer>
              <ActionsContainer>
                <Button type="submit" onClick={handleSubmitDevolution} variant="contained" color="primary">
                  {' '}
                  {loading ? 'Cargando...' : 'Creando Devolucion '}{' '}
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

export const CreateDevolucionStyle = styled.div``;

export default CreateDevolucion;
