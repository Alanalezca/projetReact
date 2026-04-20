import { servDraftKeyforge, 
  servMyDrafts, 
  servSets, 
  servBasePoolCartes, 
  servFactionsFromSet, 
  servCreationNewDraft,
  servUpdateFactionsSpecificDraft,
  servUpdateFocusSurJoueurAouB,
  servUpdateFocusSurFactionAouBouC,
  servUpdateEtapeDraft,
  servDeleteDraft,
  servEnregistrementPoolsCartes,
  servRecupPoolCartesPourDraft,
  servEnregistrementCarteValidee,
  servRecupPoolCartesValideesDuDraftEnCours} from '../services/keyforgeServices.js'

export const controlleurDraftKeyforge = async (req, res, next) => {
  try {
    if (!req.session?.user?.id) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const { slug } = req.params;
    const currentUserId = req.session.user.id;
    const draft = await servDraftKeyforge(slug, currentUserId);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft introuvable' });
    }

    return res.status(200).json(draft);

  } catch (err) {
    next(err);
  }
};

export const controlleurDeleteDraft = async (req, res, next) => {
  try {
    const { parCodeDraft } = req.body;
    if (!parCodeDraft) {
      return res.status(400).json({ error: "Identifiant du draft manquant" });
    }

    const currentUserId = req.session.user.id;
    const result = await servDeleteDraft(parCodeDraft, currentUserId);
    
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(500).json({ error: "Échec de la suppression du draft" });
    }
    return res.status(200).json(Array.isArray(result) ? result[0] : result);
  } catch (err) {
    next(err);
  }
};

export const controlleurEnregistrementPoolsCartes = async (req, res, next) => {
  try {
    const { payload, idDraft } = req.body;
    const result = await servEnregistrementPoolsCartes(payload, idDraft);

    if (!result || result.length === 0) {
      return res.status(500).json({ error: "Échec de l'intégration du pool de cartes" });
    }
    return res.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
};

export const controlleurRecupPoolCartesPourDraft = async (req, res, next) => {
  try {
    const { idDraft } = req.body;
    if (!req.session?.user?.id) return res.status(401).json({ error: 'Non authentifié' });
    
    const result = await servRecupPoolCartesPourDraft(idDraft);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const controlleurMyDrafts = async (req, res, next) => {
  try {
    if (!req.session?.user?.id) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const currentUserId = req.session.user.id;  
    const drafts = await servMyDrafts(currentUserId);

    if (!drafts) {
      return res.status(404).json({ message: 'Drafts introuvable' });
    }

    return res.status(200).json(drafts);

  } catch (err) {
    next(err);
  }
};

export const controlleurSets = async (req, res, next) => {
  try {
    const sets = await servSets();

    if (!sets) {
      return res.status(404).json({ message: 'Sets introuvable' });
    }

    return res.status(200).json(sets);

  } catch (err) {
    next(err);
  }
};

export const controllerFactionsFromSet = async (req, res, next) => {
  try {
    const IDSet = req.query.setId;
    const factions = await servFactionsFromSet(IDSet);

    if (!factions) {
      return res.status(404).json({ message: 'Factions du set introuvables' });
    }

    return res.status(200).json(factions);

  } catch (err) {
    next(err);
  }
};

export const controllerBasePoolCartes = async (req, res, next) => {
  try {
    const { factions } = req.query;
    const factionsArray = factions.split(',');

    const basePoolDeCartes = await servBasePoolCartes(factionsArray);

    if (!basePoolDeCartes) {
      return res.status(404).json({ message: 'Chargement du pool de cartes échoué' });
    }

    return res.status(200).json(basePoolDeCartes);

  } catch (err) {
    next(err);
  }
};

export const controlleurCreationNewDraft = async (req, res, next) => {
  try {
    const { parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parTitreDraft, parEtat } = req.body;
    const currentUserId = req.session.user.id;
    const result = await servCreationNewDraft(parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, currentUserId, parTitreDraft, parEtat);

    if (!result) {
      return res.status(404).json({ message: 'Création du nouveau draft échouée' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurUpdateFactionsSpecificDraft = async (req, res, next) => {
  try {
    const { parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2 } = req.body;
    const currentUserId = req.session.user.id;
    const result = await servUpdateFactionsSpecificDraft(parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, currentUserId);

    if (!result) {
      return res.status(404).json({ message: 'Update des factions dans le draft en cours échouée' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurUpdateFocusSurJoueurAouB = async (req, res, next) => {
  try {
    const { parID, parJoueurAorB } = req.body;
    const currentUserId = req.session.user.id;
    const result = await servUpdateFocusSurJoueurAouB(parID, parJoueurAorB, currentUserId);

    if (!result) {
      return res.status(404).json({ message: 'Update des factions dans le draft en cours échouée' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurUpdateFocusSurFactionAouBouC = async (req, res, next) => {
  try {
    const { parID, parFactionAorBorC } = req.body;
    const currentUserId = req.session.user.id;
    const result = await servUpdateFocusSurFactionAouBouC(parID, parFactionAorBorC, currentUserId);

    if (!result) {
      return res.status(404).json({ message: 'Update des factions dans le draft en cours échouée' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurUpdateEtapeDraft = async (req, res, next) => {
  try {
    const { parID, parEtape } = req.body;
    const currentUserId = req.session.user.id;
    const result = await servUpdateEtapeDraft(parID, parEtape, currentUserId);

    if (!result) {
      return res.status(404).json({ message: 'Update de l etape du draft en cours échouée' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurEnregistrementCarteValidee = async (req, res, next) => {

  try {
    const { parIDDraft, parIDCard, parJAorB, Classement, ClassementCardToDeleteA, ClassementCardToDeleteB, reinitFocusFactionDuDraft, reinitFocusJoueurDuDraft, draftJ1Finished, draftJ2Finished, etape } = req.body;
    const result = await servEnregistrementCarteValidee(parIDDraft, parIDCard, parJAorB, Classement, ClassementCardToDeleteA, ClassementCardToDeleteB, reinitFocusFactionDuDraft, reinitFocusJoueurDuDraft, draftJ1Finished, draftJ2Finished, etape);

    if (!result) {
      return res.status(404).json({ message: 'Ajout de la carte validée dans le draft échoué' });
    }

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

export const controlleurRecupPoolCartesValideesDuDraftEnCours = async (req, res, next) => {
  try {
    const { idDraft } = req.body;
    if (!req.session?.user?.id) return res.status(401).json({ error: 'Non authentifié' });
    
    const result = await servRecupPoolCartesValideesDuDraftEnCours(idDraft);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
