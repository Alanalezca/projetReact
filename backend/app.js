import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import articlesRoutes from './routes/articles.js';
import usersRoutes from './routes/users.js';

dotenv.config(); 

const app = express();
console.log('Initialisation – connexion BDD à :', process.env.DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000', // autorise uniquement ton frontend
  credentials: true, // autorise les cookies et autres informations d'authentification
};

app.use(cors(corsOptions)); // Mettre CORS avant les routes

app.use(express.json());

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/articles', articlesRoutes);

// Production : sert le frontend React
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Route par défaut en dev
  app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur backend !!!');
  });
}

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose s\'est mal passé!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
