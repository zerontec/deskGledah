/* eslint-disable no-lone-blocks */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-undef */
/* eslint-disable import/order */
import React, { useState , useEffect} from 'react';

import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { getAllInvoices } from '../../../redux/modules/invoices';
import numeral from 'numeral';
import { useDispatch, useSelector } from "react-redux";
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

} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../utils/formatTime';
import { SearchInvoiceByDate } from '../../../components/SearchInvoiceByDate';
import { getAllNotas } from '../../../redux/modules/notasC';

import styled, { css } from 'styled-components';
import { jsPDF } from "jspdf";


const columns = [
	{
	  id: "id",
	  label: "Numero Factura",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Fecha",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Cedula o Rif",
	  minWidth: 50,
	},
	{
	  id: "gender",
	  label: "Monto Total de factura",
	  minWidth: 50,
	},
	{
	  id: "address",
	  label: "Afectada por Devolucion",
	  minWidth: 150,
	},
  ];
const InvoiceTable = () => {
//   const [invoices, setInvoices] = useState([]);

const dispatch = useDispatch();
const [selectedInvoices, setSelectedinvoices] = useState(null)


 const TableRow = styled.tr`
 ${({ affected }) =>
   affected &&
   css`
     background-color: yellow;
   `}
`;



const formatAmountB = (amount) => numeral(amount).format('0,0.00');
  

useEffect(()=> {

  dispatch(getAllInvoices())
  dispatch(getAllNotas());

}, [dispatch])

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Llamada a la acción getAllInvoices y getAllNotas con manejo de errores
//       await dispatch(getAllInvoices());
//       await dispatch(getAllNotas());
//     } catch (error) {
//       console.error('Error fetching invoices and notes:', error);
      
//       if (error.response && error.response.status === 404) {
//         const errorMessage = error.response.data.message;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: errorMessage,
//         });
//       } else {
//         console.error('No hay datos que mostrar:', error);
//       }
      
//     }
//   };

//   fetchData();
// }, [dispatch]);

const invoices = useSelector((state) => state.invoices);





  const invoice = useSelector((state) => state.invoice);
  const creditNotes = useSelector((state) => state.notasc);
  
  console.log(invoice)
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleSearch = () => {
    // Lógica para buscar facturas por el valor de búsqueda (searchQuery)
  };

 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  fDateTime()


function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}


const generatePDF = () => {
  if (!selectedInvoices) {
    return;
  }

  const { invoiceNumber, credit, status, clienteData, vendedorData, productoFactura, totalProductosSinIva, ivaTotal, amount, metodoPago, createdAt } = selectedInvoices;

  // Crear un nuevo documento PDF
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

    // Agregar el membrete al PDF
    const companyName = 'Galeria Amar, C.A';
    const companyAddress = 'Av Antonio Paez San Felix ';
    doc.text(companyName, 20, 10);
    doc.text(companyAddress, 20, 18);
  

  // Agregar el número de factura
  doc.setFontSize(16);
  doc.text(`Número de Factura: ${invoiceNumber}`, 20, 28);

  // Agregar la fecha de la factura
  doc.setFontSize(12);
  doc.text(`Fecha de Factura: ${fDateTime(createdAt)}`, 20, 35);

  // Agregar los datos generales de la factura
  doc.setFontSize(12);
  doc.text(`Factura a crédito: ${credit ? 'Sí' : 'No'}`, 20, 40);
  doc.text(`Estado: ${status}`, 20, 50);
  doc.text(`Cliente: ${clienteData.name}`, 20, 60);
  doc.text(`Cédula o Rif: ${clienteData.identification}`, 20, 70);
  doc.text(`Código Vendedor: ${vendedorData?.codigo}`, 20, 80);
  doc.text(`Nombre Vendedor: ${vendedorData?.name}`, 20, 90);

  // Agregar la lista de productos
  doc.setFontSize(14);
  doc.text('Lista de Productos:', 20, 110);

  let y = 120;
  doc.setFontSize(12);
  doc.text('Código', 20, y);
  doc.text('Producto', 60, y);
  doc.text('Cantidad', 120, y);
  doc.text('Precio sin Iva', 160, y);

  y += 10;
  productoFactura.forEach((product) => {
    doc.text(product.barcode.toString(), 20, y);
    doc.text(product.name.toString(), 60, y);
    doc.text(product.quantity.toString(), 120, y);
    doc.text(product.preProductoUndSinIva.toFixed(2).toString(), 160, y);
    y += 10;
  });

  // Agregar los totales
  doc.setFontSize(12);
  doc.text(`Total Producto: ${totalProductosSinIva.toString()}`, 20, y + 20);
  doc.text(`Iva 16%: ${ivaTotal.toString()}`, 20, y + 30);
  doc.text(`Total más Iva: ${amount.toString()}`, 20, y + 40);

  // Agregar los métodos de pago
  doc.setFontSize(14);
  doc.text('Métodos de Pago:', 20, y + 60);

  y += 70;
  doc.setFontSize(12);
  metodoPago.forEach((metodo, index) => {
    doc.text(`Método ${index + 1}: ${metodo.method}`, 20, y + index * 10);
    doc.text(`Monto: ${metodo.amount.toFixed(2)}`, 60, y + index * 10);
  });

  // Guardar el documento PDF
  doc.save('factura.pdf');
};


  return (
<>
<hr />
 
<Modal open={selectedInvoices !== null} onClose={() => setSelectedinvoices(null)}>
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
    {selectedInvoices && (
      <>
        <h2>
          <strong>Numero Factura:</strong>
        </h2>
        <h3>{selectedInvoices?.invoiceNumber}</h3>
        <p>
          <p>
            <strong>Factura a credito:</strong>
            {selectedInvoices?.credit ? 'Sí' : 'No'}
          </p>
          <strong>Status:</strong>
          {capitalizeFirstLetter(selectedInvoices?.status)}
        </p>
        <p>
          <strong>Cliente:</strong>
          {capitalizeFirstLetter(selectedInvoices?.clienteData?.name)}
        </p>
        <p>
          <strong>Cedula o Rif:</strong>
          {selectedInvoices?.clienteData?.identification}
        </p>
        <p>
          <strong>Codigo Vendedor:</strong>
          {selectedInvoices?.vendedorData?.codigo}
        </p>
        <p>
          <strong>Nombre Vendedor:</strong>
          {capitalizeFirstLetter(selectedInvoices?.vendedorData?.name)}
        </p>

        <h3>Lista de Productos:</h3>
        <ul>
          {selectedInvoices?.productoFactura.map((product) => (
            <li key={product?.barcode}>
              <strong>Código: </strong> {product?.barcode}
              <br />
              <strong>Producto: </strong> {capitalizeFirstLetter(product?.name)}
              <br />
              <strong>Cantidad: </strong> {product?.quantity}
              <br />
              <strong>Precio sin Iva: </strong>{' '}
              {product.preProductoUndSinIva.toFixed(2)}
            </li>
          ))}
        </ul>

        <p>
          <strong>Total Producto: </strong>
          {selectedInvoices?.totalProductosSinIva}
        </p>
        <p>
          <strong>Iva 16%: </strong>
          {selectedInvoices?.ivaTotal}
        </p>
        <p>
          <strong>Total mas Iva: </strong>
          {selectedInvoices?.amount}
        </p>

        <h3>Metodo de Pago:</h3>
        <ul>
          {selectedInvoices?.metodoPago?.map((metodo) => (
            <li key={metodo?.amount}>
              <strong>Instrumento: </strong>
              {capitalizeFirstLetter(metodo?.method)}
              <br />
              <strong>Monto: </strong>
              {formatAmountB(metodo?.amount.toFixed(2))}
              <br />
            </li>
          ))}
        </ul>

        <p>
          <strong>Fecha de Venta: </strong>
          {fDateTime(selectedInvoices?.createdAt)}
        </p>

        <p>
          <strong>Fecha de Vencimiento: </strong>
          {fDateTime(selectedInvoices?.dueDate)}
        </p>

        <Button variant="contained" onClick={() => setSelectedinvoices(null)}>
          Cerrar
        </Button>

        <Button variant="contained" onClick={generatePDF} style={{marginLeft:10, backgroundColor:'red'}}>
          
          Generar <PictureAsPdfIcon/>
        </Button>
      </>
    )}
  </Box>
</Modal>


{/* End Modal nalysis  */}

<Box sx={{ m: 2 }}>
 <div style={{marginLeft:70}}>
  
  
  <SearchInvoiceByDate /></div>
  
  
        <TextField
          label="Buscar Facturas po Numero"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button> */}
       
  
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {" "}
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    minWidth={column.minWidth}
                  >
                    {" "}
                    {column.label}{" "}
                  </TableCell>
                ))}{" "}
              </TableRow>
            </TableHead>
            <TableBody>
              {" "}
              {Array.isArray(invoice?.invoices) && invoice?.invoices.length > 0 ? (
        invoice?.invoices
          .filter((item) =>
            item?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item) => {
            const affected = creditNotes?.notas?.some(
              (note) => note.facturaAfectada === item.invoiceNumber
            );

            return (
              <TableRow key={item.id} affected={affected}>
                <TableCell align="left">{item?.invoiceNumber}</TableCell>
                <TableCell align="left">{fDateTime(item?.createdAt)}</TableCell>
                <TableCell align="left">{item?.clienteData.identification}</TableCell>
                <TableCell align="left">{item?.amount}</TableCell>
                <TableCell align="left">
                  {affected ? 'Sí' : 'No'}
                </TableCell>
                {/* ... */}
                <>
                      <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedinvoices(item)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                      
                    </>
              </TableRow>

              
            );
          })
      ) : (
        <TableRow>
          <TableCell colSpan={6}>No hay datos disponibles</TableCell>
        </TableRow>
      )}
  </TableBody>
  
</Table>
          <TablePagination
            rowsPerPageOptions={[5,10, 100]}
            component="div"
            count={invoice.invoices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          ></TablePagination>
        </TableContainer>
      </Box>

      <hr/>
	</>
  );
};

export default InvoiceTable;






{/* <Box>
<Typography style={{backgroundColor:'#007bff', color:"white"}} variant="h5" sx={{ marginBottom: 2 }}>
  Lista de Facturas
</Typography>
<TextField
  label="Buscar Factura"
  variant="outlined"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  sx={{ marginBottom: 2 }}
/>
<Button variant="contained" onClick={handleSearch}>
  Buscar
</Button>
<TableContainerStyled>
  <Table>
	<TableHead>
	  <TableRow>
		<TableCell>Factura</TableCell>
		<TableCell>Fecha</TableCell>
		<TableCell>Cliente</TableCell>
		<TableCell>Acciones</TableCell>
	  </TableRow>
	</TableHead>
	<TableBody>



	  {invoice.invoices.filter((items) =>
			items.invoicenumber.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
		  .map((items) => (
		<TableRow key={items.id}>
		  <TableCell>{items.invoiceNumber}</TableCell>
		  <TableCell>{items.date}</TableCell>
		  <TableCell>{items.clienteData.identification}</TableCell>
		  <TableCell>
			<ActionsContainer>
			  <Button
				variant="outlined"
				onClick={() => setSelectedinvoices(items)}
			  >
				Ver Detalles
			  </Button>
			</ActionsContainer>
		  </TableCell>
		</TableRow>
	  ))}
	</TableBody>
  </Table>
</TableContainerStyled>
{/* Aquí puedes agregar la paginación */}
{/* <TablePagination
	  rowsPerPageOptions={[5,10, 100]}
	  component="div"
	  count={invoice.length}
	  rowsPerPage={rowsPerPage}
	  page={page}
	  onPageChange={handleChangePage}
	  onRowsPerPageChange={handleChangeRowsPerPage}
	></TablePagination>
</Box> */}
 
