import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';

import { useDispatch } from 'react-redux';
import { logout } from '../../redux/modules/auth';


const Logout = () => {


	const dispatchar = useDispatch()
	
	const logoOut =() => {
		dispatchar(logout()) 
		window.location.reload()
		
		
		}
	
	return (
<>
		<Button onClick={logoOut}>
Salir
		</Button>
		</>
	);
};

export const LogoutStyle = styled.div``;

export default Logout;
