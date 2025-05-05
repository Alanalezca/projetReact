import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();

// Exemple de route GET pour lister les utilisateurs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tab_users');
    res.json(result.rows);  // Retourne tous les utilisateurs
  } catch (error) {
    console.error('Erreur récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/register', async (req, res) => {
    const { pseudo, email, password } = req.body;
    if (!pseudo || !email.includes("@") || !email.includes(".") || password.length < 6) {
      return res.status(400).json({ error: 'Champs requis manquants.', pseudo, email, password });
    }
  
    try {
      // Vérifier si le pseudo existe déjà
      const checkUser = await pool.query('SELECT * FROM tab_users WHERE pseudo = $1', [pseudo]);
      if (checkUser.rows.length > 0) {
        return res.status(409).json({ error: 'Identifiant déjà utilisé.' });
      }
      // Vérifier si l'email existe déjà
      const checkEmail = await pool.query('SELECT * FROM tab_users WHERE email = $1', [email]);
      if (checkEmail.rows.length > 0) {
        return res.status(409).json({ error: 'Email déjà utilisé.', pseudo, email, password });
      }
  
      // Créer l'utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO tab_users (pseudo, email, password) VALUES ($1, $2, $3) RETURNING id, pseudo, email',
        [pseudo, email, hashedPassword]
      );
  
      res.status(201).json({ message: 'Utilisateur créé', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur',  pseudo, email, password});
    }
  });
  
  export default router;