/* eslint-disable no-unused-expressions */
import React , {useRef, useState, useEffect}from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,

	IconButton,
	Typography,
	Avatar,
	Button,
	Stack,

	MenuItem,
	TextField,
	FormControl,
	
	Select,
	Box,
	Modal,
	Alert,
  } from '@mui/material';

  import { Icon as Iconify } from '@iconify/react';
  import { useDispatch, useSelector } from 'react-redux';
  
  import sentenceCase from '../../../utils/sentenceCase';
	import { createCustomer, deleteCustomer, getAllCustomer, updateCustomer } from '../../../redux/modules/customer';
  import { FloatingButtonComponent } from '../../../components/FloatingButtonComponent';
 
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


const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: #2065D1;
  border-radius: 20px;
`;



const Customer = () => {

	const [selected, setSelected] = useState([]);

	const [editMode, setEditMode] = useState(false);
	const [editData, setEditData] = useState({});
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
  
	const [errors, setErrors] = useState({});
	const { message } = useSelector((state) => state);
	const [loading, setLoading] = useState(false);
	const [selectButton, setSelectButton] = useState(null);
	const [messageError, setMessageError] = useState({});
  
	const dispatch = useDispatch();
  
	const anchorRef = useRef(null);


	const [formInfo, setFormInfo] = useState({
		identification: '',
		name: '',
		address: '',
		
	  });
	  const [isFormValid, setIsFormValid] = useState(false);
	
	  const validateForm = () => {
		const { name, address, identification } = formInfo;
		setIsFormValid(
		  name.trim() !== '' &&
			name.trim() !== '' &&
			identification.trim() !== '' &&
			address.trim() !== '' 
			
		);
	  };


	  useEffect(() => {
		validateForm();
	  }, [formInfo]);
	
	  function validate(formInfo) {
		// eslint-disable-next-line prefer-const
		let errors = {};
	
		formInfo.name ? (errors.name = '') : (errors.name = 'Ingrese Nombre');
	
		
	
		formInfo.identification ? (errors.identification = '') : (errors.identification = 'Ingrese un identification');
	
		formInfo.address ? (errors.address = '') : (errors.address = 'Ingrese un direccion');
	
		
	
		return errors;
	  }



	  const handleChange = (event) => {
		const { name, value } = event.target;
	
		// Si el campo de roles es un string separado por comas, conviértelo a un array
		if (name === 'roles') {
		  const rolesArray = value.toString().split(',');
		  setFormInfo((prevFormInfo) => ({
			...prevFormInfo,
			[name]: rolesArray,
		  }));
		} else {
		  setFormInfo((prevFormInfo) => ({
			...prevFormInfo,
			[name]: value,
		  }));
		}
	  };
	
	  const handleSubmitEdit = (e) => {
		if (
		  selectedUserEdit.name &&
		  
		  selectedUserEdit.identification &&
		  selectedUserEdit.address 
		 
		) {
		  e.preventDefault();
		  const data = {
			...selectedUserEdit,
			id: selectedUserId,
		  };
		  dispatch(updateCustomer(selectedUserId, data));
		  Swal.fire('¨Usero Editado con Exito  !', 'You clicked the button!', 'success');
		  dispatch(getAllCustomer());
	
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
	
	  const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
		dispatch(createCustomer(formInfo))
		  .then((response) => {
			setLoading(false);
			Swal.fire('Cliente creado con éxito!', '', 'success');
			window.location.reload();
	
			setFormInfo({
			 
			  name: '',
			  identification: '',
			  address: ''
			  
			});
	
			setSelectButton(null);
			if (response.error) {
			  setMessageError(response.error);
			}
		  })
		  .catch((error) => {
			setLoading(false);
			setSelectButton(null);
			setMessageError(error.message);
			Swal.fire(error.message);
		  });
	  };
	
	  useEffect(() => {
		dispatch(getAllCustomer());
	  }, [dispatch]);
	
	//   const handleSelectAllClick = (event) => {
	// 	if (event.target.checked) {
	// 	  const newSelected = sellers.seller.sellers.map((user) => user.id);
	// 	  setSelected(newSelected);
	// 	} else {
	// 	  setSelected([]);
	// 	}
	//   };
	
	  const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];
	
		if (selectedIndex === -1) {
		  newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
		  newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
		  newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
		  newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
	
		setSelected(newSelected);
	  };
	
	  // const handleEditClick = (event, user) => {
	  //   setEditMode(true);
	  //   setEditData(user);
	
	  // };
	
	  const [selectedUserId, setSelectedUserId] = useState(null);
	  const [open, setOpen] = useState(false);
	
	  const handleEditClick = (user) => {
		setSelectedUserId(user.id);
		setSelectedUserEdit({
		  name: user.name,
		 
		  identification: user.identification,
		  address: user.addres,
		  
		});
		setOpen(true);
	  };
	
	  const [selectedUserEdit, setSelectedUserEdit] = useState({
		name: '',
		
		identification: '',
		address: '',
		
	  });
	
	  const handleEditCancel = () => {
		setEditData({});
		setEditMode(false);
	  };
	
	//   const handleEditSave = () => {
	// 	const { id, data } = editData;
	// 	dispatch(updateCustomer(id, data))
	// 	  .then((response) => {
	// 		setEditData({});
	// 		setEditMode(false);
	// 		// Realizar acciones adicionales después de la actualización, si es necesario
	// 	  })
	// 	  .catch((error) => {
	// 		// Manejar el error en caso de que ocurra
	// 		setMessageError(error.message);
	// 		Swal.fire(error.message);
	// 	  });
	//   };
	
	  const handleDeleteClick = (event, id) => {
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
			dispatch(deleteCustomer(id));
			Swal.fire('El usuario ha sido borrado!');
	
			setTimeout(() => {
			  window.location.reload();
			}, 500);
		  } else {
			Swal.fire('El usuario  Esta Seguro !');
		  }
		});
	  };
	
	  //   const handleDeleteMultipleClick = () => {
	
	  //     Swal.fire({
	  // 		  title: "Estas Seguro",
	  // 		  text: "No podras revertir esta operacion !",
	  // 		  icon: "advertencia",
	  // 		  showCancelButton: true,
	  // 		  confirmButtonColor: "#3085d6",
	  // 		  cancelButtonColor: "#d33",
	  // 		  confirmButtonText: "Si, Borrar!",
	  // 		}).then((result) => {
	  // 		  if (result.isConfirmed) {
	  //     const seleccion = { ids: selected };
	
	  //     dispatch(deleteMultiplyUser(seleccion));
	  //     setSelected([]);
	  //     Swal.fire("El usuario ha sido borrado!");
	
	  //     setTimeout(() => {
	  //       window.location.reload();
	  //     }, 500);
	  //     } else {
	  //     Swal.fire("El usuario  Esta Seguro !");
	  //     }
	  //   });
	
	  //   };
	
	  const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setPage(1);
	  };
	
	  //   const handlePageChange = (event, newPage) => {
	  //     setPage(newPage);
	  //   };
	
	  const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(1);
	  };
	  const clientes = useSelector((state) => state.customer);
	  console.log('selelr', clientes);
	
	  // Filtrar usuarios en función del término de búsqueda
	  let filteredUsers;
	
	  if (clientes && clientes.customers && Array.isArray(clientes.customers.customer)) {
		
		filteredUsers = clientes.customers.customer.filter(
		  (user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.identification.toLowerCase().includes(searchTerm.toLowerCase())
		);
	  } else {
		filteredUsers = [];
	  }
	
	  const startIndex = (page - 1) * rowsPerPage;
	  const endIndex = startIndex + rowsPerPage;
	
	  // Obtener los usuarios de la página actual
	  const usersOnPage = filteredUsers.slice(startIndex, endIndex);
	
	  const handleCloseModal = () => {
		setSelectedUserId(null);
		setSelectedUserEdit({
		  name: '',
		 
		  identification: '',
		  address: '',
		 
		});
		setOpen(false);
	  };

    function capitalizeFirstLetter(text) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
    }



	return (
<>
 {/* Modal para editar el análisis */}
 <Modal open={open} onClose={handleCloseModal}>
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
          <h2>Editar Usuario</h2>
          {selectedUserEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormContainer>
                <FieldContainer>
                  <TextField
                    type="text"
                    value={setSelectedUserId.id}
                    onChange={(e) =>
                      setSelectedUserId({
                        ...selectedUserId,
                        id: e.target.value,
                      })
                    }
                  />
                
                  <TextField
                    label="Nombre"
                    type="text"
                    value={selectedUserEdit.name}
                    onChange={(e) =>
                      setSelectedUserEdit({
                        ...selectedUserEdit,
                        name: e.target.value,
                      })
                    }
                  />

                  <br />

                  <TextField
                    label="Cedula"
                    name="identification"
                    type="identification"
                    value={selectedUserEdit.identification}
                    onChange={(e) =>
                      setSelectedUserEdit({
                        ...selectedUserEdit,
                        identification: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Direccion"
                    name="address"
                    type="address"
                    value={selectedUserEdit.address}
                    onChange={(e) =>
                      setSelectedUserEdit({
                        ...selectedUserEdit,
                        address: e.target.value,
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

  
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setSelectButton()}>
          Nuevo Cliente
        </Button>
      </Stack>

      <TextField label="Buscar" value={searchTerm} onChange={handleSearch} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === usersOnPage.length}
                  indeterminate={selected.length > 0 && selected.length < usersOnPage.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell> */}
              <TableCell>Nombre</TableCell>
              <TableCell>Identificacion</TableCell>
              <TableCell>address</TableCell>
              <TableCell>Acciones</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {usersOnPage.map((user) => (
              <TableRow key={user.id} hover>
                {/* <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(user.id)} onChange={(event) => handleClick(event, user.id)} />
                </TableCell> */}
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={capitalizeFirstLetter(user.name)} src={user.avatar} />
                    <Typography variant="body2">{capitalizeFirstLetter(user.name)}</Typography>
                  </Stack>
                </TableCell>
                {/* <TableCell>{user.codigo}</TableCell> */}
                <TableCell>{user.identification}</TableCell>
                <TableCell>{sentenceCase(user.address)}</TableCell>
                {/* <TableCell>{user.telf}</TableCell> */}
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleEditClick(user)}>
                      <Iconify icon="mdi:account-edit" />
                    </IconButton>
                    <IconButton size="small" onClick={(event) => handleDeleteClick(event, user.id)}>
                      <Iconify icon="mdi:delete" />
                    </IconButton>
                    <Link to={`/dashboard/perfil-cliente/${user.id}`} style={{ textDecoration: 'none' }}>
                <button>Ver perfil</button>
              </Link>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
          Rows per page:
        </Typography>
        <FormControl variant="outlined" size="small">
          <Select value={rowsPerPage} onChange={handleRowsPerPageChange} label="Rows per page">
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
          {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
        </Typography>
      </Box>

      {/* {selected.length > 0 && (
        <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">{`${selected.length} selected`}</Typography>
            <Button variant="outlined" color="error" size="small">
              Delete Selected
            </Button>
          </Stack>
        </Card>
      )}

      <Popover
        open={editMode}
        onClose={handleEditCancel}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Name"
              value={editData.name || ''}
              onChange={(event) => setEditData({ ...editData, name: event.target.value })}
            />
            <TextField
              label="Username"
              value={editData.username || ''}
              onChange={(event) => setEditData({ ...editData, username: event.target.value })}
            />
            <TextField
              label="Email"
              value={editData.email || ''}
              onChange={(event) => setEditData({ ...editData, email: event.target.value })}
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={editData.role || ''}
                onChange={(event) => setEditData({ ...editData, role: event.target.value })}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="usergl">vendedor</MenuItem>
                <MenuItem value="usertl">usertl</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleEditSave}>Save</Button>

            <Button variant="outlined" color="error" onClick={handleEditCancel}>
              Cancel
            </Button>
          </Box>
        </Card>
      </Popover> */}

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
                  label="Nombre"
                  name="name"
                  type="text"
                  id="name"
                  value={capitalizeFirstLetter(formInfo.name)}
                  onChange={handleChange}
                />{' '}
                {errors.name && <span className="error-message"> {errors.name}</span>}
                <TextField
                  required
                  label="cedule"
                  name="identification"
                  type="text"
                  id="name"
                  value={formInfo.identification}
                  onChange={handleChange}
                />{' '}
                {errors.identification && <span className="error-message"> {errors.identification}</span>}
                <TextField
                  required
                  label="Direccion"
                  name="address"
                  id="address"
                  value={capitalizeFirstLetter(formInfo.address)}
                  onChange={handleChange}
                />{' '}
                {errors.address && <span className="error-message"> {errors.address}</span>}
               
               
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
                  {loading ? 'Cargando...' : 'Agregar Cliente'}
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

      <FloatingButtonComponent/>
    </>
  );
};

export const CustomerStyle = styled.div``;

export default Customer;
