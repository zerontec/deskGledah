import React, { useState } from 'react';

import axios from 'axios';
import { Button } from '@mui/material';
import numeral from 'numeral';

import Swal from 'sweetalert2';

import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

const columns = [
  {
    id: 'id',
    label: 'Fecha',
    minWidth: 50,
  },
  {
    id: 'name',
    label: 'Total Ventas',
    minWidth: 100,
  },
  {
    id: 'age',
    label: 'Total Ventas a Credito ',
    minWidth: 50,
  },
  {
    id: 'age',
    label: 'Resumen Metodos de Pago',
    minWidth: 50,
  },
];

const SalesReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [errorMessage, setErrrorMessage] = useState({});
  const API_URL_D = 'http://localhost:5040/';
  const API_URL = 'https://expressjs-postgres-production-bd69.up.railway.app/';

  const [summary, setSummary] = useState(null);

  const generateSummary = () => {
    axios
      .get(`${API_URL_D}api/dayli/sales-report`)
      .then((response) => {
        setSummary(response.data);

        if (response.error) {
          setErrrorMessage(response.error);
        }
      })

      .catch((error) => {
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        } else {
          console.error('Error al generar el resumen del cierre de ventas:', error);
        }
      });
  };

  const formatAmountB = (amount) => numeral(amount).format('0,0.00');

  return (
    <div>
      <Button variant="contained" onClick={generateSummary}>
        Generar Cierre
      </Button>

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
            {summary && (
              <TableRow>
                <TableCell align="left">{summary.date}</TableCell>
                <TableCell align="left">${summary.totalSales}</TableCell>
                <TableCell align="left">${summary.creditSales}</TableCell>
                <TableCell className="tableCell">
                  <ul>
                    {Object.entries(summary.paymentTotals).map(([method, amount]) => (
                      <li key={method}>
                        <strong>{method}: </strong>
                        {formatAmountB(amount)}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* <Button variant="contained" onClick={handleSubmitPurchase}>
	Enviar
  </Button> */}
        </Table>
      </TableContainer>
    </div>
  );
};

export default SalesReport;
