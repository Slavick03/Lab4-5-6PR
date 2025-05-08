import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="main-container">
        <Link to="/" className="btn-home">
          Home
        </Link>
      <Outlet />
    </div>
  );
}

export default Layout;
