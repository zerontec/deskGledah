/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useParams, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import Modal from '@mui/material/Modal';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import Swal from 'sweetalert2';
import {
  createPaymentClient,
  deleteUploadClient,
  getAllLoansClient,
  getAllPaymentClient,
  updateLoandClient,
} from '../../../redux/modules/loanClient';
import { fDate, fDateTime } from '../../../utils/formatTime';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';

import { PaymentTableCustomer } from '../../../components/PaymentTableCustomer';
import { CreateLoanCustomer } from '../../../components/CreateLoanCustomer';
import { ViewAbonoCustomer } from '../../../components/ViewAbonoCustomer';
// import { CreateSeller } from '../../../components/CreateSeller';

const columns = [
  {
    id: 'id',
    label: 'Id Deuda',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Nro Identificacion',
    minWidth: 100,
  },
  {
    id: 'name',
    label: 'Nombre',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Monto Actual',
    minWidth: 50,
  },
  {
    id: 'fecha',
    label: 'status',
    minWidth: 50,
  },
  {
    id: 'notes',
    label: 'Fecha',
    minWidth: 50,
  },
  {
    id: 'notes',
    label: 'Motivo',
    minWidth: 50,
  },
];


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

const ClientLoanAdmin = () => {
  // const { id } = useParams();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedLoanClientId, setSelectedLoanClientId] = useState(null);
  const [selectedLoanClientEdit, setSelectedLoanClientEdit] = useState(null);
  const [open, setOpen] = useState(false);

  const [deudasC, setDeudasC] = useState([]);

  const { message } = useSelector((state) => state);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [openEditClientModal, setOpenEditClientModal] = useState(false);

  const [openAbonoClientModal, setOpenAbonoClientModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // Clientes

  const handleCloseEditClientModal = () => {
    setOpenEditClientModal(false);
  };

  const handleOpenEditClientModal = (loan) => {
    setSelectedLoanClientId(loan.id);
    setSelectedLoanClientEdit({
      amount: loan.amount,
      notes: loan.notes,
      status: loan.status,
      phoneNumber: '',
    });
    setOpenEditClientModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenAbonoClientModal = (loanId) => {
    setSelectedLoanClientId(loanId);
    setOpenAbonoClientModal(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const usuarios = useSelector((state) => state.usuarios);
  const deuda = useSelector((state) => state.loan);
  const deudaC = useSelector((state) => state.loanClient);

  console.log('usuarios', usuarios);
  console.log('deuda', deuda);
  console.log('deudaC', deudaC);

  useEffect(() => {
    // Llamada a la API para obtener los datos del cliente

    dispatch(getAllLoansClient())
      .then((response) => {
      setDeudasC(response);

      setFetchError(null)
    })
      
      .catch((error) => {setFetchError(error)});
  }, [dispatch]);



  function deleteHandler(item) {
    Swal.fire({
      title: 'Estas Seguro',
      text: 'No podras revertir esta operacion !',
      icon: 'advertencia',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUploadClient(item.id));
        Swal.fire('la deuda  ha sido borrado!');
        dispatch(getAllLoansClient());
      } else {
        Swal.fire('la cuenta  Esta Seguro !');
      }
    });
  }

  const handleSubmitEdit = (e) => {
    if (selectedLoanClientEdit.amount && selectedLoanClientEdit.notes) {
      e.preventDefault();

      const data = {
        ...selectedLoanClientEdit,
        id: selectedLoanClientId,
      };
      dispatch(updateLoandClient(selectedLoanClientId, data));
      Swal.fire('¨Prestamo Editado con Exito  !', 'You clicked the button!', 'success');

      dispatch(getAllLoansClient());

      handleCloseEditClientModal();
      //   getAllAnalysis();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe completar toda la informacion !',
      });

      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedLoanClientId(null);
    setSelectedLoanClientEdit({
      amount: '',
      notes: '',
      status: '',
      phoneNumber: '',
    });
    setOpen(false);
  };

  fDateTime();

  return (
    <>
      <Typography variant="h4" component="h1">
        Prestamos y Abonos Clientes
      </Typography>
      <hr />
      <Box display="flex" justifyContent="space-between" marginLeft={10} marginRight={60} marginBottom={2}>
        <CreateLoanCustomer />
        {/* <CreateSeller/> */}
      </Box>

      <hr />
      <Typography variant="h5" component="h3">
        Deudas Clientes
      </Typography>
      <TextField
          label="Buscar Cliente Numero Identificacion"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      {fetchError ? (
        <p>Hubo un problema al cargar los datos de cuentas por pagar.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left" minWidth={column.minWidth}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(deudaC.loansClients) && deudaC.loansClients.length > 0 ? (
                deudaC.loansClients
                  .filter((item) => item.customer?.identification.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">{item.id}</TableCell>
                      <TableCell align="left">{item.customer?.identification}</TableCell>
                      <TableCell align="left">{item.customer?.name}</TableCell>
                      <TableCell align="left">{item.amount}</TableCell>
                      <TableCell align="left">{item.status}</TableCell>
                      <TableCell align="left">{fDateTime(item.createdAt)}</TableCell>
                      <TableCell align="left">{item.notes}</TableCell>
                      {/* Agrega más columnas según las propiedades de la deuda */}
                      <TableCell className="tableCell">
                        <Button variant="contained" onClick={() => handleOpenEditClientModal(item)}>
                          Editar
                        </Button>
                      </TableCell>
                      <TableCell className="tableCell">
                        <Button variant="contained" onClick={() => handleOpenAbonoClientModal(item.id)}>
                          Abonar
                        </Button>
                      </TableCell>
                      <TableCell className="tableCell">
                        <ViewAbonoCustomer loanId={item.id}/>
                      </TableCell>
                      <TableCell className="tableCell">
                      <Link to={`/dashboard/perfil-cliente/${item.customer?.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" > perfil</Button>
                      </Link>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>No hay datos disponibles</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 100]}
            component="div"
            count={deudaC.loansClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <PaymentTableCustomer
        loanId={selectedLoanClientId}
        openAbonoClientModal={openAbonoClientModal}
        handleCloseAbonoClientModal={() => setOpenAbonoClientModal(false)}
      />






      <Modal open={openEditClientModal} onClose={handleCloseEditClientModal}>
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
          <h2>Editar Prestamo</h2>
          {selectedLoanClientEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormContainer>
                <FieldContainer>
                  <TextField
                    type="text"
                    value={setSelectedLoanClientId.id}
                    onChange={(e) =>
                      setSelectedLoanClientId({
                        ...selectedLoanClientId,
                        id: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Cantidad"
                    type="number"
                    value={selectedLoanClientEdit.amount}
                    onChange={(e) =>
                      setSelectedLoanClientEdit({
                        ...selectedLoanClientEdit,
                        amount: e.target.value,
                      })
                    }
                  />

                  <br />
                  <TextField
                    label="Nota"
                    name="notes"
                    value={selectedLoanClientEdit.notes}
                    onChange={(e) =>
                      setSelectedLoanClientEdit({
                        ...selectedLoanClientEdit,
                        notes: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Estatus"
                    name="status"
                    value={selectedLoanClientEdit.status}
                    onChange={(e) =>
                      setSelectedLoanClientEdit({
                        ...selectedLoanClientEdit,
                        status: e.target.value,
                      })
                    }
                  />

                  <br />
                </FieldContainer>
                <ActionsContainer>
                  <Button variant="contained" type="submit" color="primary" onClick={handleSubmitEdit}>
                    Guardar cambios
                  </Button>
                </ActionsContainer>
              </FormContainer>
            </form>
          )}
          <hr />
          <Button variant="contained" onClick={() => handleCloseEditClientModal()}>
            Cerrar
          </Button>
        </Box>
      </Modal>

      <FloatingButtonComponent />
    </>
  );
};

export default ClientLoanAdmin;
