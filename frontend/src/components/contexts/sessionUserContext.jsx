// Imports nécessaires
import React, { createContext, useState, useContext } from 'react';

// Création du contexte vide en vue d'accueillir le Provider
const SessionUserContext = createContext();

// Hook personnalisé pour y accéder(permet de n'avoir à écrire que useSessionUserContext pour accéder)
export const useSessionUserContext = () => useContext(SessionUserContext);

// Composant Provider (composant englobant, a destination du index.js dans le cas présent)
export const SessionUserContextProvider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState(null);
  // Elements qui seront fournis ici aux composants enfants {children}
  return (
    <SessionUserContext.Provider value={{ sessionUser, setSessionUser }}>
      {children}
    </SessionUserContext.Provider>
  );
};