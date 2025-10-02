import React, { createContext, useContext, useState, useCallback } from "react";
import ToastNotification from "../components/ToastNotification";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({
      show: true,
      message: typeof message === "string" ? message : JSON.stringify(message),
      type: ["success", "error", "warning", "info", "failed"].includes(type)
        ? type
        : "success",
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={toast.type === "error" ? 5000 : 3000}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
