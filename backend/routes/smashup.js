// backend/routes/smashup.js
import express from 'express';
import { pool } from '../db.js'; // Note bien l'extension .js
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

router.get('/factions', async (req, res) => {
  const filtreBoxes = req.query.filtreBoxes ?? "";
  try {
    const result = await pool.query(`SELECT f."CodeFaction", f."CodeBox", f."Libelle", f."LienImg", f."Classement", f."AvecTitan" FROM l_smashup_factions f WHERE f."Actif" = TRUE AND (($1::text = '') OR (('$' || $1::text || '$') LIKE '%$' || f."CodeBox" || '$%')) GROUP BY f."CodeFaction", f."CodeBox", f."Libelle", f."LienImg", f."Classement", f."AvecTitan" ORDER BY f."Classement";`,
      [filtreBoxes]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Factions non trouvés' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des factions:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;