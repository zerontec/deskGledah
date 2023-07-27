/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/self-closing-comp */
import React, { useState , useEffect} from 'react';

import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

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
import Swal from 'sweetalert2';


import styled, { css } from 'styled-components';
import { jsPDF } from "jspdf";
import { fDateTime } from '../../../utils/formatTime';
import { deleteExpense, getAllExpense, updateExpense } from '../../../redux/modules/expenses';
import { CreateExpenses } from '../../../components/CreateExpenses';

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
	  id: "name",
	  label: "Monto",
	  minWidth: 100,
	},
	{
		id: "id",
		label: "Ver",
		minWidth: 50,
	  },

  ];




const TableExpenses = () => {
	

	const [searchQuery, setSearchQuery] = useState('');
	const dispatch = useDispatch();
	const [selectedExpenses, setSelectedexpenses] = useState(null)
	const [selectedExpensesId, setSelectedExpensesId] = useState(null)

	const [open, setOpen] = useState(false);


	useEffect(() => {
		// Llamada a la API para obtener los datos de los pacientes y almacenarlos en el estado del componente.
		dispatch(getAllExpense());
		
	  }, [dispatch]);
	
	
	  const gastos = useSelector((state) => state.expense);
	  
	  console.log("gastos", gastos);
	  
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
	

	const [selectedExpenseEdit, setSelectedExpenseEdit] = useState({
		concepto: '',
		monto: '',
		fecha: '',
	  });


	  const handleEditClick = (expense) => {
		setSelectedExpensesId(expense.id);
		setSelectedExpenseEdit({
		  concepto: expense.concepto,
		 monto: expense.monto,
		  fecha: expense.fecha,
		});
		setOpen(true);
	  };

	const handleSubmit = (e) => {
		if (selectedExpenseEdit.concepto&& selectedExpenseEdit.monto && selectedExpenseEdit.fecha) {
		  e.preventDefault();
	
		  const data = {
			...selectedExpenseEdit,
			id: selectedExpensesId,
		  };
		  dispatch(updateExpense(selectedExpensesId, data));
		  Swal.fire('¨Gasto  Editado con Exito  !', 'You clicked the button!', 'success');
		  dispatch(getAllExpense());
	
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
			dispatch(deleteExpense(items.id));
			Swal.fire('El gasto ha sido borrado!');
	
			setTimeout(() => {
			  window.location.reload();
			}, 500);
		  } else {
			Swal.fire('El gasto  Esta Seguro !');
		  }
		});
	  }
	
	
const formatAmountB = (amount) => numeral(amount).format('0,0.00');
  
const handleCloseModal = () => {
    setSelectedExpensesId(null);
    setSelectedExpenseEdit({
    concepto: '',
      monto: '',
      fechae: '',
     
    });
    setOpen(false);
  };
	
	return(
<>
<Modal open={selectedExpenses !== null} onClose={() => setSelectedexpenses(null)}>
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
    {selectedExpenses && (
      <>
       
		<p>
      
          <strong>Concepto:</strong>
          {capitalizeFirstLetter(selectedExpenses.concepto)}
        </p>
        <p>
          <strong>Monto:</strong>
          {selectedExpenses.monto}
        </p>
        <p>
          <strong>Fecha:</strong>
          {fDateTime(selectedExpenses.fecha)}
        </p>
      
     

    

     

      
		
        <Button variant="contained" onClick={() => setSelectedexpenses(null)}>
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
          <h2>Editar Producto</h2>
          {selectedExpenseEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormContainer>
                <FieldContainer>
                  <TextField
                    type="text"
                    value={setSelectedExpensesId.id}
                    onChange={(e) =>
                      setSelectedExpensesId({
                        ...selectedExpensesId,
                        id: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Concepto"
                    type="text"
                    value={selectedExpenseEdit.concepto}
                    onChange={(e) =>
						setSelectedExpenseEdit({
                        ...selectedExpenseEdit,
                        concepto: e.target.value,
                      })
                    }
                  />

                  <br />
                  <TextField
                    label="Monto"
                    name="monto"
                    value={selectedExpenseEdit.monto}
                    onChange={(e) =>
						setSelectedExpenseEdit({
                        ...selectedExpenseEdit,
                        monto: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Fecha"
                    name="fecha"
					type='date'
                    value={selectedExpenseEdit.fecha}
                    onChange={(e) =>
						setSelectedExpenseEdit({
                        ...selectedExpenseEdit,
                        fecha: e.target.value,
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
 <div style={{marginLeft:70}}>
  
  
  <CreateExpenses/></div>
  
  
        <TextField
          label="Buscar Gasto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
   
  
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
              {Array.isArray(gastos.expenses.expenses) && gastos.expenses.expenses.length > 0 ? (
        gastos.expenses.expenses
          .filter((item) =>
            item.concepto.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item) => (
          

            
              <TableRow key={item.id} >
                <TableCell align="left">{item.concepto}</TableCell>
                <TableCell align="left">{item.monto}</TableCell>
             
                <>
                      <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => setSelectedexpenses(item)}
                        >
                          Ver
                        </Button>
                      </TableCell>

					  <TableCell className="tableCell">
                        <Button
                          variant="contained"
                          onClick={() => handleEditClick(item)}
                        >
                         Editar
                        </Button>
                      </TableCell>

					  <TableCell className="tableCell">
                          <div className="deleteButton" id={item.id} onClick={() => deleteHandler(item)}>
                            <Button>Borrar</Button>
                          </div>
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
            rowsPerPageOptions={[5,10, 100]}
            component="div"
            count={gastos?.expenses.expenses?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          ></TablePagination>
        </TableContainer>
      </Box>





</>


	)
};

export const TableExpensesStl = styled.div``;

TableExpenses.propTypes = {};

export default TableExpenses;