// backend/routes/keyforge.js
import express from 'express';
const router = express.Router();
import { checkSiCurrentUserGetGradeRequis } from '../middleware/checkSiUserGradeOK.js'
import { controlleurDraftKeyforge, 
  controlleurMyDrafts, 
  controlleurSets, 
  controllerFactionsFromSet, 
  controllerBasePoolCartes, 
  controlleurCreationNewDraft,
  controlleurUpdateFactionsSpecificDraft,
  controlleurUpdateFocusSurJoueurAouB,
  controlleurUpdateFocusSurFactionAouBouC,
  controlleurUpdateEtapeDraft,
  controlleurDeleteDraft,
  controlleurEnregistrementPoolsCartes,
  controlleurRecupPoolCartesPourDraft,
  controlleurEnregistrementCarteValidee,
  controlleurRecupPoolCartesValideesDuDraftEnCours} from '../controllers/controllersKeyforge.js'

router.get('/basePoolCartes', controllerBasePoolCartes);

router.get('/sets', controlleurSets);

router.get('/factionsFromSet', controllerFactionsFromSet);

router.get('/myDrafts', controlleurMyDrafts);

router.get('/draftKeyforge/:slug', controlleurDraftKeyforge);

router.post('/creationNewDraft/', controlleurCreationNewDraft);

router.post('/updateFactionsSpecificDraft/', controlleurUpdateFactionsSpecificDraft);

router.post('/updateFocusSurJoueurAouB/', controlleurUpdateFocusSurJoueurAouB);

router.post('/updateFocusSurFactionAouBouC/', controlleurUpdateFocusSurFactionAouBouC);

router.post('/updateEtapeDraft/', controlleurUpdateEtapeDraft);

//router.post('/delete', checkSiCurrentUserGetGradeRequis('Administrateur'), controlleurDeleteDraft);

router.post('/delete', controlleurDeleteDraft);

router.post('/enregistrementPoolsCartes', controlleurEnregistrementPoolsCartes);

router.post('/recupPoolCartesPourDraft', controlleurRecupPoolCartesPourDraft);

router.post('/enregistrementCarteValidee', controlleurEnregistrementCarteValidee);

router.post('/recupPoolCartesValideesDuDraftEnCours', controlleurRecupPoolCartesValideesDuDraftEnCours);

export default router;