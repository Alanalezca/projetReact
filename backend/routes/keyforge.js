// backend/routes/keyforge.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();
import { checkSiCurrentUserGetGradeRequis } from '../middleware/checkSiUserGradeOK.js'

router.get('/sets', async (req, res) => {
  try {
    const result = await pool.query(`SELECT l_keyforge_sets."ID", l_keyforge_sets."Annee", l_keyforge_sets."Numero", l_keyforge_sets."Libelle" FROM l_keyforge_sets ORDER BY l_keyforge_sets."Numero";`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération de la liste des sets:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/factionsFromSet', async (req, res) => {
  const IDSet = req.query.setId;
  try {
    const result = await pool.query(`SELECT DISTINCT f."ID", f."Libelle", f."LienImg" FROM tab_affectations_keyforge_sets_factions a JOIN l_keyforge_factions f ON f."ID" = a."IDFaction" WHERE a."IDSet" = $1`, [IDSet]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des infos des factions du set passé en paramètre :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/myDrafts', async (req, res) => {
  if (!req.session?.user?.id) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  const userID = req.query.userId;
  try {
    const result = await pool.query(`SELECT d."ID", d."PseudoJ1", d."PseudoJ2", d."FactionsJ1", d."FactionsJ2", d."AvecAnomalies", d."Etat", d."Commentaire", d."DateCreation", d."DateDerModif", d."IDSet", s."ID" AS "SetID", d."Titre" FROM tab_keyforge_draftsessions d LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID" WHERE d."CreePar" = $1 ORDER BY d."DateCreation";`, [userID]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération de la liste des drafts:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/draftKeyforge/:slug', async (req, res) => {
  if (!req.session?.user?.id) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  const { slug } = req.params;
  try {
    const result = await pool.query(`SELECT d."ID", d."PseudoJ1", d."PseudoJ2", d."FactionsJ1", d."FactionsJ2", d."AvecAnomalies", d."Etat", d."Commentaire", d."DateCreation", d."DateDerModif", d."IDSet", s."ID" AS "SetID", d."Titre", s."Libelle", s."Numero" FROM tab_keyforge_draftsessions d LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID" WHERE d."ID" = $1 AND d."CreePar" = $2`, [slug, req.session.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des infos du draft passé en paramètre :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/creationNewDraft', checkSiCurrentUserGetGradeRequis('Administrateur'), async (req, res) => {
  const { parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parCreePar, parTitreDraft, parEtat} = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tab_keyforge_draftsessions ("ID", "PseudoJ1", "PseudoJ2", "AvecAnomalies", "IDSet", "DateCreation", "DateDerModif", "CreePar", "Titre", "Etat")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parCreePar, parTitreDraft, parEtat]
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ error: "Échec de la création de l'article" });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la création du nouvel article :`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/delete', checkSiCurrentUserGetGradeRequis('Administrateur'), async (req, res) => {
  const { parCodeDraft } = req.body;
  
  try {
    const result = await pool.query(`DELETE FROM tab_keyforge_draftsessions WHERE "ID" = $1 RETURNING *`,
      [parCodeDraft]);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: "Échec de la suppression du draft" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la suppression du draft :`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;