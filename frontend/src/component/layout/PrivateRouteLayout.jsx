import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteLayout = () => {
    const user = localStorage.getItem("usuario")?true:false;

    return (
        user ? <Outlet /> : <Navigate to="/login" replace/>
    );
}
export default PrivateRouteLayout;