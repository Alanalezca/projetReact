// Imports nécessaires
import React, { createContext, useState, useContext } from 'react';

// Création du contexte vide en vue d'accueillir le Provider
const KeyforgeContext = createContext();

// Hook personnalisé permettant d'y accéder
export const useKeyforgeContext = () => useContext(KeyforgeContext);

// Composant Provider
export const KeyforgeContextProvider = ({ children }) => {
  const [poolCartesGlobal, setPoolCartesGlobal] = useState(null);
  const [cartesValidees, setCartesValidees] = useState([]);
  const [draftEnCoursParJoueurAouB, setDraftEnCoursParJoueurAouB] = useState(null);
  const [draftEnCoursSurFactionAouBouC, setDraftEnCoursSurFactionAouBouC] = useState(null);

  return (
    <KeyforgeContext.Provider value={{ poolCartesGlobal, setPoolCartesGlobal, cartesValidees, setCartesValidees, draftEnCoursParJoueurAouB, setDraftEnCoursParJoueurAouB, draftEnCoursSurFactionAouBouC, setDraftEnCoursSurFactionAouBouC }}>
      {children}
    </KeyforgeContext.Provider>
  );
};