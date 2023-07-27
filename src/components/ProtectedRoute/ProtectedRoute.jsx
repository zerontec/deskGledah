/* eslint-disable react/prop-types */
import React from 'react';
import {Navigate,Outlet} from 'react-router-dom';



const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/',
    children,
  }) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children || <Outlet />;
  };


  export default ProtectedRoute


  