/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
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
  Checkbox,
  TablePagination
} from '@mui/material';

import { Document, Page, pdfjs } from '@react-pdf/renderer';
import { Icon as Iconify } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {  updateSeller, deleteSeller, getAllSeller, createSellers } from '../../../redux/modules/seller';
import sentenceCase from '../../../utils/sentenceCase';
import generatePDF from '../../../utils/generatePdf';
import { BackButton } from '../../../components/BackButton';
import { CreateSeller } from '../../../components/CreateSeller';


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
    label: 'Seleccion',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Codigo Barra',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Producto',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'descripcion',
    minWidth: 50,
  },
  {
    id: 'address',
    label: 'precio',
    minWidth: 150,
  },
  {
    id: 'check',
    label: 'Exitencia',
  },
  {
    id: 'canti',
    label: ' Defectuosos',
  },
];

const Seller = () => {
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
  const [selectedSeller, setSelectedSeller] = useState(null);
  const dispatch = useDispatch();
  const [pdfContent, setPdfContent] = useState(null);

  const anchorRef = useRef(null);

  const [formInfo, setFormInfo] = useState({
    codigo: '',
    name: '',
    identification: '',
    address: '',
    telf: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const { name, codigo, identification, address, telf } = formInfo;
    setIsFormValid(
      name.trim() !== '' &&
        codigo.trim() !== '' &&
        identification.trim() !== '' &&
        address.trim() !== '' &&
        telf.trim() !== '' // Verificar si el array de roles tiene al menos un elemento
    );
  };

  useEffect(() => {
    validateForm();
  }, [formInfo]);

  function validate(formInfo) {
    // eslint-disable-next-line prefer-const
    let errors = {};

    formInfo.name ? (errors.name = '') : (errors.name = 'Ingrese Nombre');

    formInfo.codigo ? (errors.codigo = '') : (errors.codigo = 'Ingrese una Codigo');

    formInfo.identification ? (errors.identification = '') : (errors.identification = 'Ingrese un identification');

    formInfo.address ? (errors.address = '') : (errors.address = 'Ingrese un direccion');

    formInfo.telf ? (errors.telf = '') : (errors.telf = 'Ingrese un telefono');

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
      selectedUserEdit.codigo &&
      selectedUserEdit.identification &&
      selectedUserEdit.address &&
      selectedUserEdit.telf
    ) {
      e.preventDefault();
      const data = {
        ...selectedUserEdit,
        id: selectedUserId,
      };
      dispatch(updateSeller(selectedUserId, data));
      Swal.fire('¨Usero Editado con Exito  !', 'You clicked the button!', 'success');
      dispatch(getAllSeller());

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


  const handlePrintClick = () => {
    window.print();
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    dispatch(createSellers(formInfo))
      .then((response) => {
        setLoading(false);
        Swal.fire('Vendedor creado con éxito!', '', 'success');
        window.location.reload();

        setFormInfo({
          codigo: '',
          name: '',
          identification: '',
          address: '',
          telf: '',
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
    dispatch(getAllSeller());
  }, [dispatch]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = sellers.seller.sellers.map((user) => user.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };





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
      codigo: user.codigo,
      identification: user.identification,
      address: user.addres,
      telf: user.telf,
    });
    setOpen(true);
  };

  const [selectedUserEdit, setSelectedUserEdit] = useState({
    name: '',
    codigo: '',
    identification: '',
    address: '',
    telf: '',
  });

  const handleEditCancel = () => {
    setEditData({});
    setEditMode(false);
  };

  const handleEditSave = () => {
    const { id, data } = editData;
    dispatch(updateSeller(id, data))
      .then((response) => {
        setEditData({});
        setEditMode(false);
        // Realizar acciones adicionales después de la actualización, si es necesario
      })
      .catch((error) => {
        // Manejar el error en caso de que ocurra
        setMessageError(error.message);
        Swal.fire(error.message);
      });
  };

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
        dispatch(deleteSeller(id));
        Swal.fire('El usuario ha sido borrado!');

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        Swal.fire('El usuario  Esta Seguro !');
      }
    });
  };

  


  const handleToggleSelect = (itemsId) => {
    if (selectedSeller.includes(itemsId)) {
      setSelectedSeller(selectedSeller.filter((id) => id !== itemsId));
    } else {
      setSelectedSeller([...selectedSeller, itemsId]);
    }
  };


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
  const sellers = useSelector((state) => state.vendedores);
  console.log('selelr', sellers);

  // Filtrar usuarios en función del término de búsqueda
  let filteredUsers;

  if (sellers && sellers.vendedores && Array.isArray(sellers.vendedores.seller)) {
    
	filteredUsers = sellers.vendedores.seller.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        // user.address.toLowerCase().includes(searchTerm.toLowerCase())
        // user.identification.toLowerCase().includes(searchTerm.toLowerCase())
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
      codigo: '',
      identification: '',
      address: '',
      telf: '',
    });
    setOpen(false);
  };


  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }



  return (
    <>
      {/* Modal para editar */}
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
                    label="codigo"
                    name="codigo"
                    value={selectedUserEdit.codigo}
                    onChange={(e) =>
                      setSelectedUserEdit({
                        ...selectedUserEdit,
                        codigo: e.target.value,
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

                  <TextField
                    label="Telefono"
                    name="telf"
                    type="telf"
                    value={selectedUserEdit.telf}
                    onChange={(e) =>
                      setSelectedUserEdit({
                        ...selectedUserEdit,
                        telf: e.target.value,
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
     
       <CreateSeller/>
                  
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
              <TableCell>Codigo</TableCell>
              <TableCell>Identificacion</TableCell>
              <TableCell>address</TableCell>
              <TableCell>Telefono</TableCell>
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
                    <Typography variant="body2">{user.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{user.codigo}</TableCell>
                <TableCell>{user.identification}</TableCell>
                <TableCell>{sentenceCase(user.address)}</TableCell>
                <TableCell>{user.telf}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleEditClick(user)}>
                      <Iconify icon="mdi:account-edit" />
                    </IconButton>
                    <IconButton size="small" onClick={(event) => handleDeleteClick(event, user.id)}>
                      <Iconify icon="mdi:delete" />
                    </IconButton>
                    <Link to={`/dashboard/perfil-empleados/${user.id}`} style={{ textDecoration: 'none' }}>
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
     
  </>)}



export default Seller;