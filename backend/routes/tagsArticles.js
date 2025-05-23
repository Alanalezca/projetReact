// backend/routes/articles.js
import express from 'express';
import { pool } from '../db.js'; // Note bien l'extension .js
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM l_tags_articles ORDER BY \"CodeTagArticle\" ASC");
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
