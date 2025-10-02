import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostProperty from "./pages/PostProperty";
import PropertyDetails from "./pages/PropertyDetails";

import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import MyListings from "../src/pages/MyListings";
import Contact from "../src/pages/Contact";
import PropertyRequestModal from "./components/PropertyRequestModal";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import { ToastProvider } from "./context/ToastContext";
import { RedirectProvider } from "./context/RedirectContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import UsersPage from "./admin/UserPage";
import PropertiesPage from "./admin/PropertiesPage";
import RequestsPage from "./admin/RequestsPage";
import SupportPage from "./admin/SupportPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  return (
    <AuthProvider>
      <ToastProvider>
        <RedirectProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<UserLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/post-property" element={<PostProperty />} />
                  <Route path="/my-listings" element={<MyListings />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route
                  path="/property-details/:id"
                  element={<PropertyDetails />}
                />

                <Route path="/faq" element={<FAQ />} />
                <Route path="/help" element={<Help />} />
                <Route
                  path="/contact"
                  element={
                    <Contact
                      isRequestModalOpen={isRequestModalOpen}
                      setIsRequestModalOpen={setIsRequestModalOpen}
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <HomePage
                      isRequestModalOpen={isRequestModalOpen}
                      setIsRequestModalOpen={setIsRequestModalOpen}
                    />
                  }
                />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="properties" element={<PropertiesPage />} />
                  <Route path="requests" element={<RequestsPage />} />
                  <Route path="support" element={<SupportPage />} />
                </Route>
              </Route>
            </Routes>

            <PropertyRequestModal
              isRequestModalOpen={isRequestModalOpen}
              setIsRequestModalOpen={setIsRequestModalOpen}
            />
          </BrowserRouter>
        </RedirectProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
