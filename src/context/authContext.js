import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSession,
  saveSession,
  logout as logoutLS,
  authenticate,
} from "../utils/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //   Load Session on App Start
  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  //   Login User
  function login(email, password) {
    const existingUser = authenticate(email, password);

    if (existingUser) {
      saveSession(existingUser);
      setUser(existingUser);
      alert("Login Successful");
      navigate("/");
      return { success: true, message: "Login Successful" };
    } else {
      alert("Invalid credentials");
      return { success: false, message: "Invalid credentials" };
    }
  }

  // Logout

  function logout() {
    logoutLS();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
