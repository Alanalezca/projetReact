import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

import articlesRoutes from './routes/articles.js';
import tagsArticlesRoutes from './routes/tagsArticles.js';
import usersRoutes from './routes/users.js';

dotenv.config(); // À placer tôt

const app = express(); // <-- doit être déclaré avant son premier usage
console.log('Initialisation – connexion BDD à :', process.env.DATABASE_URL);

const pgSession = connectPgSimple(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// Middleware de session
app.use(session({
  name: 'sid',
  store: new pgSession({
    pool: pool,
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 1 jour
  },
}));

// CORS – autoriser le frontend à communiquer avec le backend
const corsOptions = {
  origin: ['http://localhost:3000', 'https://nexus-backend-68rm.onrender.com'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour parser les JSON
app.use(express.json());

// Servir le build React
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));
console.log('Frontend Build Path:', frontendBuildPath);

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/tagsArticles', tagsArticlesRoutes);

// Fallback React
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    next();
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
