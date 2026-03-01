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
    const result = await pool.query(`SELECT d."ID", d."PseudoJ1", d."PseudoJ2", d."FactionBanJ1", d."FactionBanJ2", d."FactionPickAJ1", d."FactionPickBJ1", d."FactionPickCJ1", d."FactionPickAJ2", d."FactionPickBJ2", d."FactionPickCJ2", d."FactionBanJ1", d."FactionPickAJ1", d."FactionPickBJ1", d."FactionPickCJ1", d."FactionBanJ2", d."FactionPickAJ2", d."FactionPickBJ2", d."FactionPickCJ2", d."AvecAnomalies", d."Etat", d."Commentaire", d."DateCreation", d."DateDerModif", d."IDSet", s."ID" AS "SetID", d."Titre" FROM tab_keyforge_draftsessions d LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID" WHERE d."CreePar" = $1 ORDER BY d."DateCreation";`, [req.session.user.id]);
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
    const result = await pool.query(`SELECT d."ID", d."PseudoJ1", d."PseudoJ2", d."FactionBanJ1", d."FactionBanJ2", d."FactionPickAJ1", fa1."LienImg" AS "LienImgAJ1", d."FactionPickBJ1", fb1."LienImg" AS "LienImgBJ1", d."FactionPickCJ1", fc1."LienImg" AS "LienImgCJ1", d."FactionPickAJ2", fa2."LienImg" AS "LienImgAJ2", d."FactionPickBJ2", fb2."LienImg" AS "LienImgBJ2", d."FactionPickCJ2", fc2."LienImg" AS "LienImgCJ2", d."AvecAnomalies", d."Etat", d."Commentaire", d."DateCreation", d."DateDerModif", d."IDSet", s."ID" AS "SetID", d."Titre", s."Libelle", s."Numero" FROM tab_keyforge_draftsessions d LEFT JOIN l_keyforge_sets s ON d."IDSet" = s."ID" LEFT JOIN l_keyforge_factions fa1 ON d."FactionPickAJ1" = fa1."ID" LEFT JOIN l_keyforge_factions fb1 ON d."FactionPickBJ1" = fb1."ID" LEFT JOIN l_keyforge_factions fc1 ON d."FactionPickCJ1" = fc1."ID" LEFT JOIN l_keyforge_factions fa2 ON d."FactionPickAJ2" = fa2."ID" LEFT JOIN l_keyforge_factions fb2 ON d."FactionPickBJ2" = fb2."ID" LEFT JOIN l_keyforge_factions fc2 ON d."FactionPickCJ2" = fc2."ID" WHERE d."ID" = $1 AND d."CreePar" = $2;`, [slug, req.session.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des infos du draft passé en paramètre :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/creationNewDraft', checkSiCurrentUserGetGradeRequis('Administrateur'), async (req, res) => {
  const { parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, parTitreDraft, parEtat} = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tab_keyforge_draftsessions ("ID", "PseudoJ1", "PseudoJ2", "AvecAnomalies", "IDSet", "DateCreation", "DateDerModif", "CreePar", "Titre", "Etat")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [parID, parJoueurA, parJoueurB, parPresenceAnomalies, parSet, parDateCreation, parDateMaj, req.session.user.id, parTitreDraft, parEtat]
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

router.post('/updateFactionsSpecificDraft', checkSiCurrentUserGetGradeRequis('Administrateur'), async (req, res) => {
  const { parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2 } = req.body;
  try {
    console.log("parID:", parID);
    console.log("userId:", req.session.user.id);
    const result = await pool.query(
      `UPDATE tab_keyforge_draftsessions SET "Etat" = '8', "FactionBanJ1" = $2, "FactionBanJ2" = $3, "FactionPickAJ1" = $4, "FactionPickBJ1" = $5, "FactionPickCJ1" = $6, "FactionPickAJ2" = $7, "FactionPickBJ2" = $8, "FactionPickCJ2" = $9
      WHERE "ID" = $1 AND "CreePar" = $10
      RETURNING *`,
      [parID, parFactionBanJ1, parFactionBanJ2, parFactionPickAJ1, parFactionPickBJ1, parFactionPickCJ1, parFactionPickAJ2, parFactionPickBJ2, parFactionPickCJ2, req.session.user.id]
    );
    console.log("rowCount:", result.rowCount);
    if (result.rows.length === 0) {
      return res.status(500).json({ error: "Échec de la mise à jour des factions du draft passé en paramètre" });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la mise à jour des factions du draft :`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/delete', checkSiCurrentUserGetGradeRequis('Administrateur'), async (req, res) => {
  const { parCodeDraft } = req.body;
  
  try {
    const result = await pool.query(`DELETE FROM tab_keyforge_draftsessions WHERE "ID" = $1 AND "CreePar" = $10 RETURNING *`,
      [parCodeDraft, req.session.user.id]);

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