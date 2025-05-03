import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import articlesRoutes from './routes/articles.js';
import usersRoutes from './routes/users.js';

dotenv.config(); 

const app = express();
console.log('Initialisation – connexion BDD à :', process.env.DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS
const corsOptions = {
  origin: 'https://mon-frontend.onrender.com', // Remplace par la vraie URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/articles', articlesRoutes);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose s\'est mal passé!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
