import { getCurrentDraft, 
  getMyDrafts, 
  getSets, 
  getFactionsFromSet, 
  getBasePoolCartes, 
  doCreationNewDraft, 
  doUpdateFactionsSpecificDraft,
  doUpdateFocusSurJoueurAouB,
  doUpdateEtapeDraft,
  doUpdateFocusSurFactionAouBouC,
  doDeleteDraft,
  doEnregistrementPoolsCartes,
  getPoolCartesPourDraft,
  doEnregistrementCarteValideeEtReinitFactionCurrentDraft,
  getPoolCartesValideesDuDraftEnCours
  } from '../repositories/repositoriesKeyforge.js'

export const servDraftKeyforge = async (slug, userId) => {
  return await getCurrentDraft.findBySlug(slug, userId);
};

export const servMyDrafts = async (userId) => {
  return await getMyDrafts.findByUserId(userId);
};

export const servSets = async () => {
  return await getSets.findSets();
};

export const servFactionsFromSet = async (IDSet) => {
  return await getFactionsFromSet.findFactions(IDSet);
};

export const servBasePoolCartes = async (factionsArray) => {
  return await getBasePoolCartes.findCartes(factionsArray);
};

export const servCreationNewDraft = async (parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parUserID, parTitreDraft, parEtat) => {
  return await doCreationNewDraft.createNewDraft(parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parUserID, parTitreDraft, parEtat);
};

export const servUpdateFactionsSpecificDraft = async (parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, currentUserId) => {
  return await doUpdateFactionsSpecificDraft.updateFactionsSpecificDraft(parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, currentUserId);
};

export const servUpdateFocusSurJoueurAouB = async (parID, parJoueurAorB, currentUserId) => {
  return await doUpdateFocusSurJoueurAouB.updateFocusSurJoueurAouB(parID, parJoueurAorB, currentUserId);
};

export const servUpdateFocusSurFactionAouBouC = async (parID, parFactionAorBorC, currentUserId) => {
  return await doUpdateFocusSurFactionAouBouC.updateFocusSurFactionAouBouC(parID, parFactionAorBorC, currentUserId);
};

export const servUpdateEtapeDraft = async (parID, parEtape, currentUserId) => {
  return await doUpdateEtapeDraft.updateEtapeDraft(parID, parEtape, currentUserId);
};

export const servDeleteDraft = async (parCodeDraft, userId) => {
  return await doDeleteDraft.deleteDraft(parCodeDraft, userId);
};

export const servEnregistrementPoolsCartes = async (payload, idDraft) => {
  const finalArray = [];
  payload.forEach((item, index) => {
    finalArray.push(idDraft, item.ID, item.PlayerAorB, index);
  });

  const placeholders = payload.map((_, i) => 
    `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
  ).join(",");
  
  const requeteSQL = `INSERT INTO tab_affectations_keyforge_draftpool_cartes ("IDDraftSession","IDCarte","JoueurAouB","Classement") VALUES ${placeholders} RETURNING *;`;

  return await doEnregistrementPoolsCartes.savePool(requeteSQL, finalArray);
};

export const servRecupPoolCartesPourDraft = async (idDraft) => {
  return await getPoolCartesPourDraft.findPool(idDraft);
};

export const servEnregistrementCarteValidee = async (parIDDraft, parIDCard, parJAorB, Classement, ClassementCardToDeleteA, ClassementCardToDeleteB, reinitFocusFactionDuDraft, reinitFocusJoueurDuDraft, draftJ1Finished, draftJ2Finished) => {
  return await doEnregistrementCarteValideeEtReinitFactionCurrentDraft.saveCardValidee(parIDDraft, parIDCard, parJAorB, Classement, ClassementCardToDeleteA, ClassementCardToDeleteB, reinitFocusFactionDuDraft, reinitFocusJoueurDuDraft, draftJ1Finished, draftJ2Finished);
};

export const servRecupPoolCartesValideesDuDraftEnCours = async (idDraft) => {
  return await getPoolCartesValideesDuDraftEnCours.findPool(idDraft);
};

