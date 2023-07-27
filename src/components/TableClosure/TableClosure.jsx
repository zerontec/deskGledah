import React,{useState, useEffect} from 'react';

import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import numeral from 'numeral';
import { jsPDF } from "jspdf";

import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";


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
  Typography

} from '@mui/material';
import { fDateTime } from '../../utils/formatTime';

import { FloatingButtonComponent } from '../FloatingButtonComponent';
import { getAllClosure } from '../../redux/modules/reports';


const columns = [
	{
	  id: "id",
	  label: "Fecha",
	  minWidth: 50,
	},
	{
	  id: "name",
	  label: "Monto de Cierre",
	  minWidth: 100,
	},
  {
	  id: "name",
	  label: "Total Ventas a Credito ",
	  minWidth: 100,
	},
	{
	  id: "age",
	  label: "Resumen Metodos y cambio",
	  minWidth: 50,
	},

  ];


const TableClosure = () => {

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const dispatch = useDispatch();
	
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const formatAmountB = (amount) => numeral(amount).format('0,0.00');
  fDateTime()



  useEffect(() => {
   
    dispatch(getAllClosure());
  }, [dispatch]);

const reportes =useSelector((state)=> state.report)

console.log("reportes", reportes)


const generatePDF = () => {
  if (!reportes.reports) {
    return;
  }

  reportes.reports.forEach((item) => {
    const { date, totalSales, paymentTotals , creditSales} = item;

    // Verificar si paymentTotals es una cadena de texto válida
    if (typeof paymentTotals === 'string') {
      try {
        // Intentar convertir paymentTotals a un objeto
        const paymentTotalsObj = JSON.parse(paymentTotals);

        // Verificar si paymentTotalsObj es un objeto válido
        if (typeof paymentTotalsObj === 'object' && paymentTotalsObj !== null) {
          // Crear un nuevo documento PDF con tamaño "letter" (8.5 x 11 pulgadas)
          // eslint-disable-next-line new-cap
          const doc = new jsPDF('portrait', 'pt', 'letter');

          // Configurar propiedades del documento
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor('#000000');

          // Centrar el contenido en el documento
          const pageWidth = doc.internal.pageSize.getWidth();
          const textWidth = doc.getStringUnitWidth(`Fecha: ${date}`) * doc.internal.getFontSize();
          const textX = (pageWidth - textWidth) / 2;

          // Agregar el contenido al PDF
          doc.text(`Fecha: ${date}`, textX, 50);
          doc.text(`Total de Ventas: $${formatAmountB(totalSales)}`, textX, 70);
          
          doc.text(`Total Ventas a Credito: $${formatAmountB(creditSales)}`, textX, 80);

          let yPos = 100;
          Object.entries(paymentTotalsObj).forEach(([method, amount]) => {
            doc.text(`${capitalizeFirstLetter(method)}: ${formatAmountB(amount)}`, textX, yPos);
            yPos += 20;
          });

          // Guardar el documento PDF
          doc.save('resumen_cierre_ventas.pdf');
        } else {
          // El objeto paymentTotalsObj no es válido
          console.error('El objeto paymentTotalsObj no es válido:', paymentTotalsObj);
        }
      } catch (error) {
        // Error al analizar la cadena JSON
        console.error('Error al analizar la cadena JSON:', error);
      }
    } else {
      // paymentTotals no es una cadena de texto válida
      console.error('paymentTotals no es una cadena de texto válida:', paymentTotals);
    }
  });
};






	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	  };
	
	  const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	  };
	

	  const handleSearch = () => {
		// Lógica para buscar facturas por el valor de búsqueda (searchQuery)
	  };
	





    return (
      <>

<Typography variant='h5'> Cierre de Ventas Diarios  </Typography>
       <hr/>
        <Box sx={{ m: 2 }}>
          <div style={{ marginLeft: 70 }} />
          <TextField
            label="Buscar Reportes"
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
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align="left"
            minWidth={column.minWidth}
          >
            {column.label}
          </TableCell>
        ))}
        <TableCell align="left">Acciones</TableCell> {/* Nueva columna para las acciones */}
      </TableRow>
    </TableHead>
    <TableBody>
      {Array.isArray(reportes.reports) && reportes.reports.length > 0 ? (
        reportes.reports
          .filter((item) =>
            item.date.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item) => {
            // Convertir paymentTotals en un objeto JSON
            const paymentTotalsObj = JSON.parse(item.paymentTotals);
            return (
              <TableRow key={item.id}>
                <TableCell align="left">{item.date}</TableCell>
                <TableCell align="left">
                  <strong>${formatAmountB(item.totalSales)}</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>${formatAmountB(item.creditSales)}</strong>
                </TableCell>
                {/* Renderizar paymentTotals */}
                <TableCell align="left">
                  <ul>
                    {Object.entries(paymentTotalsObj).map(([method, amount]) => (
                      <li key={method}>
                        <strong>{method}: </strong>
                        <strong>{formatAmountB(amount)}</strong>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell align="left">
                  {/* Botón para generar el PDF */}
                  {pdfGenerated ? (
                    <Button variant="contained" disabled>
                      PDF Generado
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={generatePDF}>
                      Generar PDF
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })
      ) : (
        <TableRow>
          <TableCell colSpan={7}>No hay datos disponibles</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
  <TablePagination
    rowsPerPageOptions={[5, 10, 100]}
    component="div"
    count={reportes.reports.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
</TableContainer>



        </Box>
        <FloatingButtonComponent />
      </>
    );
  };

export default TableClosure;



// export default AccountPayablePages;



