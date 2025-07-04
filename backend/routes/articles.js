// backend/routes/articles.js
import express from 'express';
import { pool } from '../db.js'; // Note bien l'extension .js
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo" AS PseudoCreateur, tab_articles."LienImg", STRING_AGG(l_tags_articles."Libelle", ',') AS Tags FROM tab_affectations_tags_articles LEFT OUTER JOIN l_tags_articles ON tab_affectations_tags_articles."CodeTagArticle" = l_tags_articles."CodeTagArticle" RIGHT OUTER JOIN tab_articles INNER JOIN tab_users ON tab_articles."CreePar" = tab_users.id ON tab_affectations_tags_articles."CodeArticle" = tab_articles."CodeArticle" WHERE COALESCE(tab_articles."Publie", false) = true GROUP BY tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo", tab_articles."LienImg" ORDER BY "DateMaj" DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`SELECT tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo" AS PseudoCreateur, tab_articles."LienImg", STRING_AGG(l_tags_articles."Libelle", ',') AS Tags, tab_articles."Publie" AS "Publie" FROM tab_affectations_tags_articles LEFT OUTER JOIN l_tags_articles ON tab_affectations_tags_articles."CodeTagArticle" = l_tags_articles."CodeTagArticle" RIGHT OUTER JOIN tab_articles INNER JOIN tab_users ON tab_articles."CreePar" = tab_users.id ON tab_affectations_tags_articles."CodeArticle" = tab_articles."CodeArticle" GROUP BY tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo", tab_articles."LienImg" ORDER BY "DateCreation" DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(`SELECT tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo" AS "PseudoCreateur", tab_articles."LienImg", STRING_AGG(l_tags_articles."Libelle", ',') AS "Tags" FROM tab_affectations_tags_articles LEFT OUTER JOIN l_tags_articles ON tab_affectations_tags_articles."CodeTagArticle" = l_tags_articles."CodeTagArticle" RIGHT OUTER JOIN (tab_articles INNER JOIN tab_users ON tab_articles."CreePar" = tab_users.id) ON tab_affectations_tags_articles."CodeArticle" = tab_articles."CodeArticle" WHERE tab_articles."Slug" = $1 GROUP BY tab_articles."CodeArticle", tab_articles."Titre", tab_articles."Resume", tab_articles."Slug", tab_articles."Contenu", tab_articles."DateCreation", tab_articles."DateMaj", tab_articles."CreePar", tab_users."pseudo", tab_articles."LienImg"`, [slug]);
    res.json(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
  } catch (err) {
    console.error(`Erreur lors de la récupération de l'articles:`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/validationCreation', async (req, res) => {
  const { parCodeArticle, parTitre, parResume, parSlug, parContenu, parDateCreation, parDateMaj, parCreePar, parLienImg } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO tab_articles ("CodeArticle", "Titre", "Resume", "Slug", "Contenu", "DateCreation", "DateMaj", "CreePar", "LienImg")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [parCodeArticle, parTitre, parResume, parSlug, parContenu, parDateCreation, parDateMaj, parCreePar, parLienImg]
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

router.post('/validationMaJ', async (req, res) => {
  const { parCodeArticle, parTitre, parResume, parSlug, parContenu, parDateMaj, parLienImg } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE tab_articles SET "CodeArticle" = $1, "Titre" = $2, "Resume" = $3, "Slug" = $4, "Contenu" = $5, "DateMaj" = $6, "LienImg" = $7 WHERE "CodeArticle" = $1 RETURNING *`,
      [parCodeArticle, parTitre, parResume, parSlug, parContenu, parDateMaj, parLienImg]
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

export default router;
