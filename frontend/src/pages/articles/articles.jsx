import Card from '../../components/others/Card';
import CardLoading from '../../components/others/CardLoading';
import styles from './articles.module.css';
import { useState, useEffect } from 'react';

const Articles = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [articles, setArticles] = useState([]);

  useEffect(() => {
      fetch('/api/tagsArticles')
      .then(response => response.json())
      .then(data => {
        console.log('tags', data);
        setTags(data);
      })
      .catch(error => console.error('Erreur fetch articles:', error));
  }, []);

    useEffect(() => {
      fetch('/api/articles')
      .then(response => response.json())
      .then(data => {
        console.log('articles', data);
        setArticles(data);
        setIsLoading(false);
      })
      .catch(error => console.error('Erreur fetch articles:', error));
  }, []);

  return (
    <div className="container-xl mt-4">
      <div className="row">
        <div className="col-9">
          <div className="p-3">
              {isLoading ? 
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  <CardLoading classCSSColorBackground="bgcolorC"/>
                  <CardLoading classCSSColorBackground="bgcolorC"/>
                  <CardLoading classCSSColorBackground="bgcolorC"/>
                </div>
              :
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {articles.slice(0, 3).map((currentArticles, index) => (
                    <Card classCSSColorBackground="bgcolorC" cheminImg="\images\articles\articleA.png" classCSSColorTxtTitre="txtColorA" titre="Card title" classCSSColorTxtContenu="txtColorWhite" texteContenu="This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." classCSSColorTxtBottom="txtColorD" texteBottom="Last updated 3 mins ago" key={currentArticles.CodeArticle} />
                  ))}
                </div>
              }
                <div className="row row-cols-12 row-cols-md-12 g-4 mt-4">
                  {articles.slice(3, 999).map((currentArticles, index) => (



<div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="..." class="img-fluid rounded-start" alt="..."/>
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>





                  ))}
                </div>
          </div>
        </div>

        <div className="col-3">
          <div className="input-group mt-2 mb-1 px-3">
            <span className={`${styles.inputSearch} input-group-text`} id="libelleInputSearchArticles">@</span>
            <input type="text" className={`${styles.inputSearch} form-control`} placeholder="Recherche..." aria-label="rechercheArticles" aria-describedby="basic-addon1"></input>
          </div>
          <div className="p-3">
            <div className="list-group">
                {tags.map((currentTags, index) => (
                  <a href="#" key={index} className="list-group-item list-group-item-action">{currentTags.Libelle}<span className="badge text-bg-primary rounded-pill">X</span></a>
                ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Articles;
