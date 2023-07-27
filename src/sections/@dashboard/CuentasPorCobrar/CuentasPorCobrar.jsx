import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';

import { getAllCuentas, updateCuenta } from '../../../redux/modules/cuentasxcobrar';
import { fDateTime } from '../../../utils/formatTime';

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

const columns = [
  {
    id: 'id',
    label: 'Status',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Monto a Cobrar',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Numero de factura',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'Ver Data',
    minWidth: 50,
  },

  {
    id: 'check',
    label: 'Acciones',
  },
];

const CuentasPorCobrar = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
    dispatch(getAllCuentas());
  }, [dispatch]);

  const cuentasxcobrar = useSelector((state) => state.cuentasxc);
  console.log(cuentasxcobrar.cuentas);

  const handleEditClick = (product) => {
    setSelectedCuentaId(product.id);
    setSelectedCuentaEdit({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setOpen(true);
  };

  const [selectedCuentaEdit, setSelectedCuentaEdit] = useState({
    name: '',
    description: '',
    price: '',
  });


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = (e) => {
    if (selectedCuentaEdit.name && selectedCuentaEdit.description && selectedCuentaEdit.price) {
      e.preventDefault();

      const data = {
        ...selectedCuentaEdit,
        id: selectedCuentaId,
      };
      dispatch(updateCuenta(selectedCuentaId, data));
      Swal.fire('Cuenta Editada con Exito  !', 'You clicked the button!', 'success');
      dispatch(getAllCuentas());

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

  const handleCloseModal = () => {
    setSelectedCuentaId(null);
    setSelectedCuentaEdit({
      name: '',
      description: '',
      price: '',
      quantity: 0,
    });
    setOpen(false);
  };

  const handleSearch = () => {
    // Lógica para realizar la búsqueda de pacientes en la API y actualizar el estado del componente con los resultados.
  };

  fDateTime();
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <>
    <hr/>
      {/* Modal Ver Analysis */}
      <Modal open={selectedCuenta !== null} onClose={() => setSelectedCuenta(null)}>
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
          {selectedCuenta && (
            <>
              <h2>Datos para Cobranza</h2>

              <ul>
                <h3>Información del Cliente:</h3>
                <p>
                  <strong>Nombre:</strong> {capitalizeFirstLetter(selectedCuenta.clienteDataC.name)}
                  <br />
                  <strong>Dirección:</strong> {capitalizeFirstLetter(selectedCuenta.clienteDataC.address)}
                  <br />
                  <strong>Identificación:</strong> {selectedCuenta.clienteDataC.identification}
                  <br />
                </p>
              </ul>
              <p>
                <strong>Factura:</strong> {selectedCuenta.invoiceId}
              </p>

              <p>
                <strong>Monto:</strong> {selectedCuenta.montoCobrar}
              </p>
              <p>
                <strong>Fecha Compra:</strong> {fDateTime(selectedCuenta.createdAt)}
              </p>
              <p>
                <strong>Fecha Vencimiento:</strong> {fDateTime(selectedCuenta.dueDate)}
              </p>

              <Button variant="contained" onClick={() => setSelectedCuenta(null)}>
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
      {/* End Modal nalysis  */}
      {/* Modal Ver Cliente */}

      <Modal open={selectedCliente !== null} onClose={() => setSelectedCliente(null)}>
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
          {selectedCliente && (
            <>
              <h2>Datos de El cliente</h2>
              <p>{selectedCliente.name}</p>
              <p>
                <strong>Cedula o Rif:</strong> {selectedCliente.identification}
              </p>
              <p>
                <strong>Direccion:</strong> {selectedCliente.address}
              </p>

              <Button variant="contained" onClick={() => setSelectedCliente(null)}>
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>

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
          <h2>Editar Cuenta</h2>
          {selectedCuentaEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormContainer>
                <FieldContainer>
                  <TextField
                    type="text"
                    value={setSelectedCuentaId.id}
                    onChange={(e) =>
                      setSelectedCuentaId({
                        ...selectedCuentaId,
                        id: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Nombre"
                    type="text"
                    value={selectedCuentaEdit.name}
                    onChange={(e) =>
                      setSelectedCuentaEdit({
                        ...selectedCuentaEdit,
                        name: e.target.value,
                      })
                    }
                  />

                  <br />
                  <TextField
                    label="Descripción"
                    name="description"
                    value={selectedCuentaEdit.description}
                    onChange={(e) =>
                      setSelectedCuentaEdit({
                        ...selectedCuentaEdit,
                        description: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Precio"
                    name="price"
                    value={selectedCuentaEdit.price}
                    onChange={(e) =>
                      setSelectedCuentaEdit({
                        ...selectedCuentaEdit,
                        price: e.target.value,
                      })
                    }
                  />

                  <br />
                </FieldContainer>
                <ActionsContainer>
                  <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>
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

      <Box sx={{ m: 2 }}>
        <TextField label="Buscar Cuenta" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
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
    {Array.isArray(cuentasxcobrar.cuentas) && cuentasxcobrar.cuentas.length > 0 ? (
      cuentasxcobrar.cuentas
      .filter((items) => items.invoiceId && items.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((items) => (
          <TableRow key={items.id}>
            <TableCell align="left"> {capitalizeFirstLetter(items.status)}</TableCell>
                      {/* <TableCell align="left"> {items.clienteData.name}</TableCell>
					  <TableCell align="left"> {items.vendedorDataC.codigo}</TableCell> */}
                      <TableCell align="left"> {items.montoCobrar}</TableCell>
                      <TableCell align="left"> {items.invoiceId}</TableCell>

  
                      <>
                        <TableCell className="tableCell">
                          <Button variant="contained" onClick={() => setSelectedCuenta(items)}>
                            Ver
                          </Button>
                        </TableCell>

                        <TableCell className="tableCell">
                          {/* <Link
							to={`analisis/edit/${analisi.codigo}`}
							style={{ textDecoration: "none" }}
						  >
							<div className="viewButton">Editar</div>
						  </Link> */}
                          <Button variant="contained" onClick={() => handleEditClick(items)}>
                            Editar
                          </Button>
                        </TableCell>

                        <TableCell className="tableCell">
                          {/* <div className="deleteButton"
							id={items.id}
							onClick={() => deleteHandler(items)} 
							> 
							<Button> Borrar </Button>
						  </div > */}
                        </TableCell>
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
            count={cuentasxcobrar.cuentas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      
        <hr/>
      </Box>


    </>
  );
};

export const CuentasPorCobrarStyle = styled.div``;

export default CuentasPorCobrar;
