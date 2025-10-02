import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-20 lg:mt-24 max-w-7xl mx-auto px-4">
        {/* User-specific pages render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
