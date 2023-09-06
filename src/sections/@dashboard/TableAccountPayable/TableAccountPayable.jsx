/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';

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

import axios from 'axios';
import { Document, Page, pdfjs } from '@react-pdf/renderer';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import { deleteProduct, deleteMultiplyProducts } from '../../../redux/modules/products';
import generatePDF from '../../../utils/generatePdf';
import { getAllAbonoPorCuentas, getAllPayables } from '../../../redux/modules/accountPayables';
import { fDate, fDateTime } from '../../../utils/formatTime';

import { CreateAbonocxp } from '../../../components/CreateAbonocxp';
import { ViewAbonoscxp } from '../../../components/ViewAbonoscxp';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



const columns = [
  //   {
  //     id: 'id',
  //     label: 'Seleccion',
  //     minWidth: 50,
  //   },
  {
    id: 'id',
    label: 'Numero de Compra',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Proveedor',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Rif',
    minWidth: 50,
  },
  {
    id: 'gender',
    label: 'Monto de Compra',
    minWidth: 50,
  },
  {
    id: 'address',
    label: 'Abonos',
    minWidth: 150,
  },
  {
    id: 'check',
    label: 'Saldo Pendiente',
  },
  {
    id: 'canti',
    label: ' Fecha de Compra',
  },
];

const TableAccountPayable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const [cuentaName, setCuentaName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [pay, setPay] = useState(null);

  const [fetchError, setFetchError] = useState(null);

  const formatAmountB = (amount) => numeral(amount).format('0,0.00');

  const [dataInfo, setDataInfo] = useState({
    compraId: selectedCuenta,
  });

  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const handleDeleteMultipleClick = () => {
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
        const seleccion = { ids: selectedProducts };

        dispatch(deleteMultiplyProducts(seleccion));
        setSelectedProducts([]);
        Swal.fire('Los productos han sido borrado!');

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        Swal.fire('Los productos  Estan Seguro !');
      }
    });
  };

  const [selectedCuentaPagos, setSelectedCuentaPagos] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllPayables());
        //   dispatch(getAllAbonoPorCuentas())

        setFetchError(null);
      } catch (error) {
        console.error('Error fetching account payable:', error);
        // Asigna el error al estado fetchError
        setFetchError(error);
      }
    };

    fetchData();
  }, [dispatch]);

  const pagables = useSelector((state) => state.payable);
  console.log(pagables);

  const handleEditClick = (product) => {
    setSelectedCuentaId(product.id);
    setSelectedCuentaEdit({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setOpen(true);
    // Llamar a la función para obtener los abonos por cuenta
    dispatch(getAllAbonoPorCuentas({ compraId: product.id.compraId }));
  };

  const [selectedCuentaEdit, setSelectedCuentaEdit] = useState({
    name: '',
    description: '',
    price: '',
  });

  function deleteHandler(items) {
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
        dispatch(deleteProduct(items.id));
        Swal.fire('El producto ha sido borrado!');

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        Swal.fire('El producto  Esta Seguro !');
      }
    });
  }

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    // Lógica para realizar la búsqueda de pacientes en la API y actualizar el estado del componente con los resultados.
  };

  fDateTime();
  const isDeleteButtonDisabled = selectedProducts.length === 0;

  return (
    <>
      <hr />

      {/* End Modal nalysis  */}

      <Box sx={{ m: 2 }}>
        <TextField
          label="Buscar Cuentas Por pagar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
        {fetchError ? (
          <p>Hubo un problema al cargar los datos de cuentas por pagar.</p>
        ) : (
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
                {Array.isArray(pagables?.payables?.accountsPayable) &&
                pagables?.payables?.accountsPayable.length > 0 ? (
                  pagables?.payables?.accountsPayable
                    .filter((items) => items.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((items) => (
                      <TableRow key={items.id}>
                        {/* 						  
						   <Checkbox
					checked={selectedProducts.includes(items.id)}
					onChange={() => handleToggleSelect(items.id)}
				  /> */}
                        <TableCell align="left"> {items?.purchase.invoiceNumber}</TableCell>
                        <TableCell align="left"> {capitalizeFirstLetter(items.supplierName)}</TableCell>
                        <TableCell align="left"> {items?.supplierRif}</TableCell>
                        <TableCell align="left"> {capitalizeFirstLetter(formatAmountB(items?.amount))}</TableCell>
                        <TableCell align="left"> {formatAmountB(items?.abonos)}</TableCell>
                        <TableCell align="left"> {formatAmountB(items?.saldoPendiente)}</TableCell>
                        <TableCell align="left"> {fDateTime(items.createdAt)}</TableCell>

                        {/* <TableCell align="left"> {items.defectuosos}</TableCell> */}

                        <>
                          <TableCell className="tableCell">
                            <ViewAbonoscxp compraId={items.purchase.id} />
                          </TableCell>
                          <TableCell className="tableCell">
                            <CreateAbonocxp compraId={items.purchase.id} />
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
              count={pagables?.payables?.accountsPayable?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Button variant="contained" onClick={handleDeleteMultipleClick} disabled={isDeleteButtonDisabled}>
              Borrar seleccionados
            </Button>
          </TableContainer>
        )}
        <hr />
      </Box>
    </>
  );
};

export default TableAccountPayable;
