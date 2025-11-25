import { useState, useEffect } from 'react'; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Articles from '../src/pages/articles/articles';
import ArticlePage from '../src/pages/articles/articlePage';
import Smashup from '../src/pages/smashup/smashup';
import DiceThrone from '../src/pages/dicethrone/dicethrone';
import ArticleCreate from '../src/pages/articles/createArticle';
import ArticleAdmin from '../src/pages/articles/adminArticles';
import Patchnotes from '../src/pages/others/patchnotes';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Articles />} />
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="/article/admin" element={<ArticleAdmin />} />
      <Route path="/article/create" element={<ArticleCreate />} />
      <Route path="/article/create/:slug" element={<ArticleCreate />} />
      <Route path="/smashup" element={<Smashup />} />
      <Route path="/dicethrone" element={<DiceThrone />} />
      <Route path="/release/patchnotes" element={<Patchnotes />} />
      <Route path="*" element={<Articles />} />
    </Routes>
  )
};

export default App;