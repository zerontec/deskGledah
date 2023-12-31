import React,{useState, useEffect} from 'react';

import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import numeral from 'numeral';
import { jsPDF } from "jspdf";
import Modal from "@mui/material/Modal";
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
	const [rowsPerPage, setRowsPerPage] = useState(100);
	const [searchTerm, setSearchTerm] = useState("");
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null)

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
  if (!selectedReport) {
    return;
  }

  // Crear un nuevo documento PDF con tamaño "letter" (8.5 x 11 pulgadas)
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('portrait', 'pt', 'letter');

  // Configurar propiedades del documento
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');

  // Agregar el membrete al PDF
  const companyName = 'Galerias Amar, C.A';
  const companyAddress = 'Av Antonio Paez San Felix ';
  doc.text(companyName, 50, 30);
  doc.text(companyAddress, 50, 50);

  // Recorrer los reportes y agregar el contenido al PDF
 
    const { date, totalSales, paymentTotals, creditSales } = selectedReport;

    // Verificar si paymentTotals es una cadena de texto válida
    if (typeof paymentTotals === 'string') {
      try {
        // Intentar convertir paymentTotals a un objeto
        const paymentTotalsObj = JSON.parse(paymentTotals);

        // Verificar si paymentTotalsObj es un objeto válido
        if (typeof paymentTotalsObj === 'object' && paymentTotalsObj !== null) {
          // Centrar el contenido en el documento
          const pageWidth = doc.internal.pageSize.getWidth();
          const textWidth = doc.getStringUnitWidth(`Fecha: ${date}`) * doc.internal.getFontSize();
          const textX = (pageWidth - textWidth) / 2;

          // Agregar el contenido al PDF
          doc.text(`Fecha: ${date}`, textX, 100);
          doc.text(`Total de Ventas: $${formatAmountB(totalSales)}`, textX, 120);
          doc.text(`Total Ventas a Crédito: $${formatAmountB(creditSales)}`, textX, 140);

          let yPos = 160;
          Object.entries(paymentTotalsObj).forEach(([method, amount]) => {
            doc.text(`${capitalizeFirstLetter(method)}: ${formatAmountB(amount)}`, textX, yPos);
            yPos += 20;
          });

          // Agregar un salto de página después de cada reporte
          // doc.addPage();
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


  // Guardar el documento PDF
  doc.save('resumen_cierre_ventas.pdf');
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

                <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedReport(item)}
                        >
                          Seleccionar para Detalles 
                        </Button>
                      </TableCell>
                      
                {/* <TableCell align="left"> */}
              {/* Botón para generar el PDF */}
              {/* <Button
                variant="contained"
                onClick={() => generatePDF(item)}
                disabled={item.pdfGenerated}
              >
                {item.pdfGenerated ? "PDF Generado" : "Generar PDF"}
              </Button>
            </TableCell> */}

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


        <Modal open={selectedReport !== null} onClose={() => setSelectedReport(null)}>
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
    {selectedReport && (
      <>
        <h2>
          <strong>Reporte de Cierre </strong>
        </h2>

        <h3><strong>Fecha de Reporte  </strong></h3>
        <h3>{selectedReport?.date}</h3>
      
        <h3>
          <strong>Total Reporte:</strong>
         
        </h3>

        <h3>{selectedReport?.totalSales}</h3>
        
       <h3>Genrar Pdf para Detalles </h3>
      
        <Button variant="contained" onClick={() => setSelectedReport(null)}>
          Cerrar
        </Button>

        <Button variant="contained" onClick={generatePDF} style={{marginLeft:10, backgroundColor:'red'}}>
          Generar PDF
        </Button>
      </>
    )}
  </Box>
</Modal>




        <FloatingButtonComponent />
      </>
    );
  };

export default TableClosure;



// export default AccountPayablePages;



