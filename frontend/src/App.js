import { useState, useEffect } from 'react';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
      fetch('/api/articles')
      .then(response => response.json())
      .then(data => {
        setArticles(data);
      })
      .catch(error => console.error('Erreur fetch articles:', error));
  }, []);

  return (
    <div>
      <h1>Liste des articles</h1>
      <ul>
        {Array.isArray(articles) && articles.map((article, index) => (
          <li key={index}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;