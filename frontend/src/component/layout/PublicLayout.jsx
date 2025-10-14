import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader'; 

function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <main>
        <Outlet /> 
      </main>
    </>
  );
}

export default PublicLayout;