// backend/routes/smashup.js
import express from 'express';
import format from 'pg-format';
import { pool } from '../db.js'; // Note bien l'extension .js
import { checkSiCurrentUserGetGradeRequis } from '../middleware/checkSiUserGradeOK.js'
const router = express.Router();

router.get('/boites', async (req, res) => {
  try {
    const result = await pool.query(`SELECT "CodeBox", "Libelle", "LienImg", "Classement" FROM public.l_smashup_boxes WHERE "Actif" = True ORDER BY "CodeBox" ASC`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des boites:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;