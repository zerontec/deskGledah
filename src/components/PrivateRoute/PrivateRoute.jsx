import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PrivateRoute = ({ element: Element, adminOnly, ...rest }) => {
  const navigate = useNavigate();
  

const user = JSON.parse(localStorage.getItem("user"));

  // Verificar si el usuario está autenticado
  const isAuthenticated = Boolean(user);

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = user?.role === 'admin';

  // Si el usuario no está autenticado o no es administrador, redirigir al componente de inicio de sesión o 404
  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    navigate(adminOnly ? '/404' : '/login');
    return null;
  }

  // Si el usuario está autenticado y es administrador (o no se requiere rol de administrador), renderizar el componente protegido
  return <Element {...rest} />;
};
export default PrivateRoute;
