import { useState, useEffect } from 'react';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Articles from '../src/pages/articles/articles';
import ArticlePage from '../src/pages/articles/articlePage';
import Smashup from '../src/pages/smashup/smashup';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Articles />} />
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="/smashup" element={<Smashup />} />
      <Route path="*" element={<Articles />} />
    </Routes>
  )
};

export default App;