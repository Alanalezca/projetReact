import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import articlesRoutes from './routes/articles.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
console.log('Initialisation – connexion BDD à :', process.env.DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS – autoriser le frontend React à communiquer avec le backend
const corsOptions = {
  origin: ['http://localhost:3000', 'https://nexus-backend-68rm.onrender.com'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour parser les JSON dans les requêtes
app.use(express.json());

// Servir le build React en statique
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));
console.log('Frontend Build Path:', frontendBuildPath);

// ➕ Route de test en environnement de développement
if (process.env.NODE_ENV !== 'production') {
  app.get('/test', (req, res) => {
    const indexPath = path.join(frontendBuildPath, 'index.html');
    console.log('📄 Tentative de lecture de :', indexPath);

    fs.access(indexPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('❌ Fichier non trouvé :', err);
        return res.status(404).send('Fichier index.html non trouvé!');
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('❌ Erreur envoi fichier :', err);
          res.status(500).send('Erreur lors de l’envoi du fichier');
        }
      });
    });
  });
}

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/articles', articlesRoutes);

// Fallback : pour toute autre requête GET non API → index.html (SPA)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    next();
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
