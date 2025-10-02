import React from "react";

import { Outlet } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
const AdminLayout = () => {
  return (
    <>
      {/* Sidebar (example for admins) */}
      <AdminNavbar />
      {/* Admin content area */}
      <main className="my-20 lg:my-24 max-w-7xl mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
