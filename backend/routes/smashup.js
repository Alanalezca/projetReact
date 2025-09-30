// backend/routes/smashup.js
import express from 'express';
import format from 'pg-format';
import { pool } from '../db.js'; // Note bien l'extension .js
import { checkSiCurrentUserGetGradeRequis } from '../middleware/checkSiUserGradeOK.js'
const router = express.Router();

router.get('/boites', async (req, res) => {
  try {
    const result = await pool.query(`SELECT l_smashup_boxes."CodeBox", l_smashup_boxes."Libelle", l_smashup_boxes."LienImg", l_smashup_boxes."Classement", COUNT(l_smashup_factions."CodeFaction") AS NbFactions FROM l_smashup_boxes LEFT JOIN l_smashup_factions ON l_smashup_boxes."CodeBox" = l_smashup_factions."CodeBox" WHERE l_smashup_boxes."Actif" = TRUE GROUP BY l_smashup_boxes."CodeBox", l_smashup_boxes."Libelle", l_smashup_boxes."LienImg", l_smashup_boxes."Classement" ORDER BY l_smashup_boxes."Classement";`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des boites:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;