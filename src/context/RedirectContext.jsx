import { createContext, useState } from "react";
export const RedirectContext = createContext();

export function RedirectProvider({ children }) {
  const [redirectPath, setRedirectPath] = useState(null);
  return (
    <RedirectContext.Provider value={{ redirectPath, setRedirectPath }}>
      {children}
    </RedirectContext.Provider>
  );
}
