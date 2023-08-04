/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
  Alert,
} from '@mui/material';
import { fDate, fDateTime } from '../../utils/formatTime';

import { getAllPayment, createPayment } from '../../redux/modules/payments';
import { getAllLoans } from '../../redux/modules/loan';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
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

const columns = [
  {
    id: 'id',
    label: 'Id de Deuda',
    minWidth: 50,
  },
  {
    id: 'id',
    label: 'Monto Abonado',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Fecha de Abono',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Empleado',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'Codigo Empleado',
    minWidth: 50,
  },
  // {
  //   id: "address",
  //   label: "Afectada por Devolucion",
  //   minWidth: 150,
  // },
];

const PaymentTable = ({ loanId, openAbonoModal, handleCloseAbonoModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const [abono, setAbono] = useState([]);
  // const [openAbonoModal, setOpenAbonoModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectButton, setSelectButton] = useState(null);
  const [messageError, setMessageError] = useState({});
  const { message } = useSelector((state) => state);

  fDateTime();

  const abonos = useSelector((state) => state.payment);
  console.log('abonos', abonos);

  useEffect(() => {
    dispatch(getAllPayment())
      .then((response) => {
        if (Array.isArray(response)) {
          setAbono(response);
        } else {
          setAbono([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [formInfo, setFormInfo] = useState({
    amount: '',
    paymentDate: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const { amount, paymentDate } = formInfo;
    setIsFormValid(amount.trim() !== '' && paymentDate.trim() !== '');
  };

  useEffect(() => {
    validateForm();
  }, [formInfo]);

  function validate(formInfo) {
    const errors = {};
    formInfo.amount ? (errors.amount = '') : (errors.amount = 'Ingrese Nombre de Producto');
    formInfo.paymentDate ? (errors.paymentDate = '') : (errors.paymentDate = 'Ingrese una Descripcion');
    return errors;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevFormInfo) => ({
      ...prevFormInfo,
      [name]: value,
    }));
    setErrors(validate({ ...formInfo, [name]: value }));
  };
  // const handleCloseAbonoModal = () => {
  //   setOpenAbonoModal(false);
  // };

  // Crear Abono
  const handleSubmitAbono = (event) => {
    event.preventDefault();
    const data = {
      ...formInfo,
      loanId,
    };
    setLoading(true);
    dispatch(createPayment(data))
      .then((response) => {
        setLoading(false);
        Swal.fire('Abono creado con éxito!', '', 'success');

        // Actualizamos los abonos después de crear un abono exitosamente
        dispatch(getAllLoans());
        dispatch(getAllPayment());

        setFormInfo({
          amount: '',
          paymentDate: '',
        });
        setSelectButton(null);
        handleCloseAbonoModal();
        if (response.error) {
          setMessageError(response.error);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setSelectButton(null);
        setMessageError(error.message);
        Swal.fire(error.message);
      });
  };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Typography variant="h5" component="h3">
          Abonos Realizados Empleados
        </Typography>

        <TextField label="Buscar Abonos" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {' '}
                {columns.map((column) => (
                  <TableCell key={column.id} align="left" minWidth={column.minWidth}>
                    {' '}
                    {column.label}{' '}
                  </TableCell>
                ))}{' '}
              </TableRow>
            </TableHead>
            <TableBody>
              {' '}
              {Array.isArray(abonos?.payments) && abonos?.payments.length > 0 ? (
                abonos?.payments
                  .filter((item) => item.seller?.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">{item.loanId}</TableCell>
                      <TableCell align="left">{item.amount}</TableCell>
                      <TableCell align="left">{fDateTime(item.createdAt)}</TableCell>
                      <TableCell align="left">{item.seller?.name}</TableCell>
                      <TableCell align="left">{item.seller?.codigo}</TableCell>

                      {/* ... */}
                      <>
                        {/* <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedAbono(item)}
                        >
                          Ver
                        </Button>
                      </TableCell> */}
                      </>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No hay datos disponibles</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 100]}
            component="div"
            count={Array.isArray(abonos?.payments) ? abonos.payments.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      <Modal open={openAbonoModal} onClose={handleCloseAbonoModal}>
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
          <form onSubmit={handleSubmitAbono}>
            <FormContainer>
              <FieldContainer>
                <TextField
                  required
                  label="ID de la deuda"
                  name="loanId"
                  type="text"
                  id="loanId"
                  value={selectedLoanId || ''}
                  disabled
                />{' '}
                {errors.barcode && <span className="error-message"> {errors.barcode}</span>}
                <TextField
                  required
                  label="Monto"
                  name="amount"
                  type="number"
                  id="amount"
                  value={formInfo.amount}
                  onChange={handleChange}
                />{' '}
                {errors.amount && <span className="error-message"> {errors.amount}</span>}
                <TextField
                  required
                  label="fecha"
                  name="paymentDate"
                  id="paymentDate"
                  type="date"
                  value={formInfo.paymentDate}
                  onChange={handleChange}
                />{' '}
                {errors.paymentDate && <span className="error-message"> {errors.paymentDate}</span>}
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
                  onClick={handleSubmitAbono}
                  variant="contained"
                  color="primary"
                  disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
                >
                  {loading ? 'Cargando...' : 'Crear Abono'}
                </Button>
              </ActionsContainer>
            </FormContainer>
          </form>
          <hr />
        </Box>
      </Modal>
    </>
  );
};

export const PaymentTableStl = styled.div``;

PaymentTable.propTypes = {};

export default PaymentTable;
