// backend/routes/dicethrone.js
import express from 'express';
import { pool } from '../db.js'; // Note bien l'extension .js
const router = express.Router();

router.get('/boites', async (req, res) => {
  try {
    const result = await pool.query(`SELECT l_dicethrone_boxes."CodeBox", l_dicethrone_boxes."Libelle", l_dicethrone_boxes."LienImg", l_dicethrone_boxes."Classement", COUNT(l_dicethrone_heros."CodeHeros") AS NbHeros, l_dicethrone_boxes."Vague" FROM l_dicethrone_boxes LEFT JOIN l_dicethrone_heros ON l_dicethrone_boxes."CodeBox" = l_dicethrone_heros."CodeBox" WHERE l_dicethrone_boxes."Actif" = TRUE GROUP BY l_dicethrone_boxes."CodeBox", l_dicethrone_boxes."Libelle", l_dicethrone_boxes."LienImg", l_dicethrone_boxes."Classement", l_dicethrone_boxes."Vague" ORDER BY l_dicethrone_boxes."Classement";`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des boites:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/heros', async (req, res) => {
  const filtreBoxes = req.query.filtreBoxes ?? "";
  try {
    const result = await pool.query(`SELECT DISTINCT h."CodeHeros", h."CodeBox", h."Libelle", h."LienImg", h."Classement", b."Vague", TRUE AS "Pickable" FROM l_dicethrone_boxes b LEFT JOIN l_dicethrone_heros h ON b."CodeBox" = h."CodeBox" WHERE h."Actif" IS TRUE AND ($1::text = '' OR ('$' || $1::text || '$') LIKE '%$' || h."CodeBox" || '$%') ORDER BY h."Classement";`,
      [filtreBoxes]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'héros non trouvés' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des héros:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;