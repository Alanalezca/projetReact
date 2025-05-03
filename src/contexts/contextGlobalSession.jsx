import React, { createContext, useContext, useState } from "react";

// 1 Création du contexte
const GlobalContext = createContext();

// 2️ Provider qui gère le thème
export const GlobalContextProvider = ({ children }) => {
    const [sessionUser, setSessionUser] = useState(null);
  
    return (
      <GlobalContext.Provider value={{ sessionUser, setSessionUser }}>
        {children}
      </GlobalContext.Provider>
    );
  };

// 3 Hook permettant l'utilisation du contexte (export du context, en gros)
//export const useGlobalContext = () => useContext(GlobalContext);