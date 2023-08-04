/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from 'react-redux';
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
import Swal from 'sweetalert2';
import {
  createPaymentClient,
  deleteUploadClient,
  getAllLoansClient,
  updateLoandClient,
} from '../../redux/modules/loanClient';

import { fDate, fDateTime } from '../../utils/formatTime';

import { getAllPaymentCustomer } from '../../redux/modules/paymentCustomer';

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
    id: 'monto',
    label: 'Monto Abonado',
    minWidth: 50,
  },
  {
    id: 'fecha',
    label: 'Fecha de Abono',
    minWidth: 100,
  },
  {
    id: 'cliente',
    label: 'Cliente',
    minWidth: 50,
  },
  {
    id: 'identification',
    label: 'identificacion Cliente',
    minWidth: 50,
  },
  // {
  //   id: "address",
  //   label: "Afectada por Devolucion",
  //   minWidth: 150,
  // },
];

const PaymentTableCustomer = ({ loanId, openAbonoClientModal, handleCloseAbonoClientModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [pago, setPago] = useState([]);
  const [selectedLoanClientId, setSelectedLoanClientId] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectButton, setSelectButton] = useState(null);
  // const [openAbonoClientModal, setOpenAbonoClientModal] = useState(false);
  const [messageError, setMessageError] = useState({});
  const { message } = useSelector((state) => state);
  const [selectedLoanClientEdit, setSelectedLoanClientEdit] = useState(null);

  fDateTime();

  const pagos = useSelector((state) => state.paymentCustomer);
  console.log('pagos', pagos);

  useEffect(() => {
    dispatch(getAllPaymentCustomer())
      .then((response) => {
        if (Array.isArray(response)) {
          setPago(response);
        } else {
          setPago([]);
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

  // Crear Abono Cliente

  const handleSubmitAbonoClient = (event) => {
    event.preventDefault();
    const data = {
      ...formInfo,
      loanId,
    };
    setLoading(true);
    dispatch(createPaymentClient(data))
      .then((response) => {
        setLoading(false);

        Swal.fire('Abono creado con éxito!', '', 'success');
        dispatch(getAllLoansClient());
        dispatch(getAllPaymentCustomer());
        setFormInfo({
          amount: '',
          paymentDate: '',
        });
        setSelectButton(null);
        handleCloseAbonoClientModal();
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
          Abonos Realizados Clientes
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
              {Array.isArray(pagos?.paymentsCustomer) && pagos?.paymentsCustomer.length > 0 ? (
                pagos?.paymentsCustomer
                  //   .filter((item) =>
                  //     item.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
                  //   )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.loanId}>
                      <TableCell align="left">{item.loanId}</TableCell>
                      <TableCell align="left">{item.amount}</TableCell>
                      <TableCell align="left">{fDateTime(item?.createdAt)}</TableCell>
                      {/* <TableCell align="left">{item.customer?.name}</TableCell>
				<TableCell align="left">{item.customer?.identification}</TableCell> */}

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
            count={Array.isArray(pagos?.paymentsCustomer) ? pagos.paymentsCustomer.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      <Modal open={openAbonoClientModal} onClose={handleCloseAbonoClientModal}>
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
          <form onSubmit={handleSubmitAbonoClient}>
            <FormContainer>
              <FieldContainer>
                <TextField
                  required
                  label="ID de la deuda"
                  name="loanId"
                  type="text"
                  id="loanId"
                  value={selectedLoanClientId || ''}
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
                  onClick={handleSubmitAbonoClient}
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

export default PaymentTableCustomer;
