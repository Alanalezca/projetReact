import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import pg from 'pg';
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

  router.post('/login', async (req, res) => {
    const { identifiant, password } = req.body;
  
    try {
      let result;
      if (identifiant.includes('@')) {
        result = await pool.query('SELECT * FROM tab_users WHERE LOWER(email) = $1', [identifiant]);
      } else {
        result = await pool.query('SELECT * FROM tab_users WHERE LOWER(pseudo) = $1', [identifiant]);
      }
   
      const user = result.rows[0];

      // 2. Compare les mots de passe
      const match = await bcrypt.compare(password, user.password); // `user.password` = hash
      if (!match) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
  
      // 3. Stocke l’ID utilisateur dans le cookie de session
      req.session.user = user;
      //res.json({ user: req.session.user });
      console.log("Session set côté serveur:", req.session);
      res.json({ message: 'Connexion réussie', user: req.session.user });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  router.get('/session', async (req, res) => {
    try {
      if (req.session && req.session.user) {
        res.json({ user: req.session.user });
      } else {
        res.status(401).json({ message: 'Aucune session active' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  });

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur lors de la destruction de session :', err);
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }

    // Efface le cookie nommé "sid" (que tu as défini dans app.js)
    res.clearCookie('sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' // ou strict si tu veux plus de sécurité
    });

    res.status(200).json({ message: 'Déconnexion réussie' });
  });
});
  
  export default router;
