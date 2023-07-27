/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
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
  Alert
} from '@mui/material';
import Swal from 'sweetalert2';
import { DriveFolderUpload } from '@mui/icons-material';
import { serachUsereById } from '../../../redux/modules/user';
import { createPayment, deleteUpload, getAllLoans, updateLoand } from '../../../redux/modules/loan';

import { fDate, fDateTime } from '../../../utils/formatTime';
import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';
import { CreateLoan } from '../../../components/CreateLoan';
import { CreateSeller } from '../../../components/CreateSeller';
import { PaymentTable } from '../../../components/PaymentTable';

const columns = [
  {
    id: 'id',
    label: 'Id Deuda',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Codigo vendedor',
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

const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;
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

const AdminPerfil = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [deudas, setDeudas] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
  const { message } = useSelector((state) => state);
  const [selectedAbonoEdit, setSelectedAbonoEdit] = useState({
    loanId:'',
    amount: '',
    paymentDate: '',
    
  });
  
  


  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAbonoModal, setOpenAbonoModal] = useState(false);
  
  const handleOpenEditModal = (loan) => {
    setSelectedLoanId(loan.id);
    setSelectedLoanEdit({
      amount: loan.amount,
      notes: loan.notes,
      status: loan.status,
    });
    setOpenEditModal(true);
  };
  
  const handleOpenAbonoModal = (loanId) => {
    setSelectedLoanId(loanId);
    setFormInfo((prevFormInfo) => ({
      ...prevFormInfo,
      loanId,
    }));
    setOpenAbonoModal(true);
  };
  
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  
  const handleCloseAbonoModal = () => {
    setOpenAbonoModal(false);
  };
  







  const handleEditClick = (loan) => {
    setSelectedLoanId(loan.id);
    setSelectedLoanEdit({
      amount: loan.amount,
      notes: loan.notes,
      status: loan.status,
    });
    setOpen(true);
  };

  const handleAbonoClick = (loan) => {
    setSelectedLoanId(loan.id);
    setSelectedAbonoEdit({
      loanId:'',
      amount: '',
      paymentDate: ''
    });
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseModal = () => {
    setSelectedLoanId(null);
    setSelectedLoanEdit({
      amount: '',
      notes: '',
      status: '',
    });
    setOpen(false);
  };

  const handleCloseModalA = () => {
    setSelectedLoanId(null);
    setSelectedAbonoEdit({
      loanId:'',
      amount: '',
      paymentDate: ''
    });
    setOpen(false);
  };

  const [selectedLoanEdit, setSelectedLoanEdit] = useState({
    amount: '',
    nota: '',
    status: '',
  });
  const handleSubmitEdit = (e) => {
    if (selectedLoanEdit.amount && selectedLoanEdit.notes) {
      e.preventDefault();

      const data = {
        ...selectedLoanEdit,
        id: selectedLoanId,
      };
      dispatch(updateLoand(selectedLoanId, data));
      Swal.fire('¨Prestamo Editado con Exito  !', 'You clicked the button!', 'success');
      window.location.reload();
      dispatch(getAllLoans());

      handleCloseModal();
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




  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const usuarios = useSelector((state) => state.usuarios);
  const deuda = useSelector((state) => state.loan);


  console.log('usuarios', usuarios);
  console.log('deuda', deuda);
  
  useEffect(() => {
    // Llamada a la API para obtener los datos del cliente
    dispatch(serachUsereById({ id }))
      .then((response) => setUser(response))
      .catch((error) => console.log(error));
    // dispatch(getClientPurchase({id}))
    // .then((response) => setCompras(response))
    // .catch((error) => console.log(error));

    dispatch(getAllLoans())
      .then((response) => setDeudas(response))
      .catch((error) => console.log(error));
  }, [id, dispatch]);

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
        dispatch(deleteUpload(item.id));
        Swal.fire('la deuda  ha sido borrado!');

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        Swal.fire('la cuenta  Esta Seguro !');
      }
    });
  }

  fDateTime();


  const [formInfo, setFormInfo] = useState({
	 
	
	
	  amount: "",
	  paymentDate: "",
	});
	const [isFormValid, setIsFormValid] = useState(false);

	const validateForm = () => {
		const { amount,paymentDate } = formInfo;
		setIsFormValid(
		 
		  amount.trim() !== "" &&
		 paymentDate.trim() !== "" 
		 
		);
	  };

	  useEffect(() => {
      validateForm();
      }, [formInfo]);
  
      function validate(formInfo) {
	
        const errors = {};
        
        formInfo.amount
        ? (errors.amount = "")
        : (errors.amount = "Ingrese Nombre de Producto");
        formInfo.paymentDate
        ? (errors.paymentDate = "")
        : (errors.paymentDate = "Ingrese una Descripcion");
      
       
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

     
      
      // Crear Abono

   const handleSubmitAbono = (event) => {
	  event.preventDefault();
    const data = {
      ...formInfo,
      loanId: selectedLoanId, // Agrega el ID de la deuda al objeto data
    };
	  setLoading(true);
	  dispatch(createPayment(data))
		.then((response) => {
		  setLoading(false);
   
		  Swal.fire("Abono creado con éxito!", "", "success");
		   window.location.reload();
		  setFormInfo({
		amount:'',
    paymentDate:''
		  });
		  setSelectButton(null);
      handleCloseAbonoModal()
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


  // const handleOpenAbonoModal = (loanId) => {
  //   setSelectedLoanId(loanId);
  //   setOpen('abono');
  // };


  return (
    <>
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
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
          {selectedLoanEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormContainer>
                <FieldContainer>
                  <TextField
                    type="text"
                    value={setSelectedLoanId.id}
                    onChange={(e) =>
                      setSelectedLoanId({
                        ...selectedLoanId,
                        id: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Cantidad"
                    type="number"
                    value={selectedLoanEdit.amount}
                    onChange={(e) =>
                      setSelectedLoanEdit({
                        ...selectedLoanEdit,
                        amount: e.target.value,
                      })
                    }
                  />

                  <br />
                  <TextField
                    label="Nota"
                    name="notes"
                    value={selectedLoanEdit.notes}
                    onChange={(e) =>
                      setSelectedLoanEdit({
                        ...selectedLoanEdit,
                        notes: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Estatus"
                    name="status"
                    value={selectedLoanEdit.status}
                    onChange={(e) =>
                      setSelectedLoanEdit({
                        ...selectedLoanEdit,
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
          <Button variant="contained" onClick={() => setOpen(null)}>
            Cerrar
          </Button>
        </Box>
      </Modal>







{/* Modal Abono  */}


<Modal open={openAbonoModal} onClose={handleCloseAbonoModal}>
		  <Box
			sx={{
			  position: "absolute",
			  top: "50%",
			  left: "50%",
			  transform: "translate(-50%, -50%)",
			  width: 400,
			  bgcolor: "background.paper",
			  borderRadius: "8px",
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
  value={selectedLoanId || ""}
  disabled
/>{" "}
				  {errors.barcode && (
					<span className="error-message"> {errors.barcode}</span>
				  )}
				  <TextField
					required
					label="Monto"
					name="amount"
					type="number"
					id="amount"
					value={formInfo.amount}
					onChange={handleChange}
				  />{" "}
				  {errors.amount && (
					<span className="error-message"> {errors.amount}</span>
				  )}
				  <TextField
					required
					label="fecha"
					name="paymentDate"
					id="paymentDate"
          type='date'
					value={formInfo.paymentDate}
					onChange={handleChange}
				  />{" "}
				  {errors.paymentDate && (
					<span className="error-message"> {errors.paymentDate}</span>
				  )}
				
  
				  {message && (
					<Alert severity="error" sx={{ mt: 2 }}>
					  {" "}
					  {messageError}{" "}
					</Alert>
				  )}{" "}
				</FieldContainer>
				<ActionsContainer>
				<Button
  type="submit"
  onClick={handleSubmitAbono}
  variant="contained"
  color="primary"
  disabled={!isFormValid} // Deshabilitar el botón si isFormValid es false
>
  {loading ? "Cargando..." : "Crear Abono"}
				  </Button>
				</ActionsContainer>
			  </FormContainer>
			</form>
			<hr />
			
		  </Box>
		</Modal>




      <StyledContainer>
        {/* {customer && ( */}
        <>
          <Box sx={{ marginBottom: '24px' }}>
            <Typography variant="h4" component="h1">
              PERFIL
            </Typography>
            <Typography variant="body1">
              <strong>Nombre: {usuarios?.usuarios?.name}</strong>
            </Typography>
            <Typography variant="body1">
              <strong>Username: {usuarios?.usuarios?.username}</strong>
            </Typography>

            <Typography variant="body1">
              <strong>Direccion: {usuarios?.usuarios?.email}</strong>
            </Typography>

            <Typography variant="body1">
              <strong>Fecha de Registro: {fDateTime(usuarios?.usuarios?.createdAt)}</strong>
            </Typography>
            {/* <Typography variant="body1">
     
     <strong>Total gastado: {compra.invoices. totalPurchases}</strong>
   </Typography> */}
            {/* Agrega más datos del cliente según tus necesidades */}
            <CreateSeller/>
            <CreateLoan />
           
           
            
          </Box>

          <Typography variant="h5" component="h3">
            Deudas Empleados
          </Typography>

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
                {Array.isArray(deuda.loans) && deuda.loans.length > 0 ? (
                  deuda.loans
                    .filter((item) => item.amount.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell align="left">{item.id}</TableCell>
                        <TableCell align="left">{item.seller?.codigo}</TableCell>
                        <TableCell align="left">{item.seller?.name}</TableCell>
                        <TableCell align="left">{item.amount}</TableCell>
                        <TableCell align="left">{item.status}</TableCell>
                        <TableCell align="left">{fDateTime(item.createdAt)}</TableCell>
                        <TableCell align="left">{item.notes}</TableCell>
                        {/* Agrega más columnas según las propiedades de la deuda */}
                        <TableCell className="tableCell">
                          <Button variant="contained" onClick={() => handleOpenEditModal(item)}>
                            Editar
                          </Button>
                        </TableCell>
                        <TableCell className="tableCell">
                        <Button onClick={() => handleOpenAbonoModal(item.id)}>Realizar Abono</Button>
                        </TableCell>
                        <TableCell className="tableCell">
                          <div className="deleteButton" id={item.id} onClick={() => deleteHandler(item)}>
                            <Button>Borrar</Button>
                          </div>
                        </TableCell>
                        <Link to={`/dashboard/perfil-empleados/${item.seller?.id}`} style={{ textDecoration: 'none' }}>
                          <button>Ver perfil</button>
                        </Link>
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
              count={deuda.loans.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>


<PaymentTable/>



          <FloatingButtonComponent />
        </>
        {/* // )} */}
      </StyledContainer>
    </>
  );
};

export default AdminPerfil;
