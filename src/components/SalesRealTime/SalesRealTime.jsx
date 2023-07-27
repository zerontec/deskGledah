import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { fetchReports } from '../../redux/modules/reports';

const SalesRealTime = () => {
	const [totalSales, setTotalSales] = useState(0);

  const [errorMessage, setErrrorMessage] = useState({});
  
  const dispatch = useDispatch();

  useEffect(() => {
	dispatch(fetchReports())
	  .then((response) => {
		setTotalSales(response.data);
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
  }, [dispatch]);
  

console.log(totalSales)

  return (
    <div>
      <h2>Total de Ventas: {totalSales}</h2>
    </div>
  );
};

export const SalesRealTimeStl = styled.div``;

SalesRealTime.propTypes = {};

export default SalesRealTime;