// backend/routes/articles.js
import express from 'express';
import { pool } from '../db.js'; // Note bien l'extension .js
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT a."CodeArticle", a."Titre", a."Resume", a."Slug", a."Contenu", a."DateCreation", a."DateMaj",a."CreePar",a."LienImg", (SELECT STRING_AGG(t."Libelle", '$' ORDER BY t."Libelle") FROM tab_affectations_tags_articles ata JOIN l_tags_articles t ON t."CodeTagArticle" = ata."CodeTagArticle" WHERE ata."CodeArticle" = a."CodeArticle") AS "Tags" FROM tab_articles a ORDER BY "DateMaj" DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM tab_articles WHERE "Slug" = $1`, [slug]);
    res.json(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
  } catch (err) {
    console.error(`Erreur lors de la récupération de l'articles:`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
