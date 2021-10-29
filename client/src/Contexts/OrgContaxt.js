import { useState, createContext, useContext } from "react";

export const OrgContext = createContext();

export const OrgProvider = ({ children }) => {
  const [org, setOrg] = useState(
    JSON.parse(localStorage.getItem("orgInfo")) || null
  );

  return (
    <OrgContext.Provider value={{ org, setOrg }}>
      {children}
    </OrgContext.Provider>
  );
};

export function useOrg() {
  return useContext(OrgContext);
}
