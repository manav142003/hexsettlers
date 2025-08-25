import { createContext, useContext, useState } from "react";

const DifferencesContext = createContext();

export function DifferencesProvider({ children }) {
  const [differences, setDifferences] = useState(null);
  return <DifferencesContext.Provider value={{ differences, setDifferences }}>{children}</DifferencesContext.Provider>;
}

export const useDifferences = () => useContext(DifferencesContext);
