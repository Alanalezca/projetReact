import Card from '../../components/others/Card';
import CardLarge from '../../components/others/CardLarge';
import CardLoading from '../../components/others/CardLoading';
import CardLargeLoading from '../../components/others/CardLargeLoading';
import styles from './articles.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Articles = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [articles, setArticles] = useState([]);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

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
        //const filteredResult = data.filter(article => article.Tags?.includes('Keyforge'));
        setArticles(data);
        setIsLoading(false);
      })
      .catch(error => console.error('Erreur fetch articles:', error));
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 992);
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="container-xl mt-4">{isLargeScreen ? "large" : "pas large"}
      <div className="row">
        <div className="col-12 col-lg-9">
          <div className="p-3">
              <div className="row row-cols-12 g-4">
                  {isLoading ? 
                  <>
                      <CardLoading classCSSColorBackground="bgcolorC" tailleCol={isLargeScreen ? 4 : 12}/>
                      <CardLoading classCSSColorBackground="bgcolorC" tailleCol={isLargeScreen ? 4 : 12}/>
                      <CardLoading classCSSColorBackground="bgcolorC" tailleCol={isLargeScreen ? 4 : 12}/>
                  </>
                  :
                  <>  {!isLoading && !articles[0] && (
                    <h2 className="mt-4 text-center txtColorWhite">Aucun article ne correspond à vos critères</h2>
                  )}
                      {articles.slice(0, 3).map((currentArticles, index) => (
                        <Card 
                          tailleCol={isLargeScreen ? 4 : 12} 
                          classCSSColorBackground="bgcolorC" 
                          cheminImg={currentArticles.LienImg} 
                          classCSSColorTxtTitre="txtColorA" 
                          titre={currentArticles.Titre} 
                          classCSSColorTxtContenu="txtColorWhite" 
                          texteContenu={currentArticles.Resume.length >= 170 ? currentArticles.Resume.substring(0, 170) + "..." : currentArticles.Resume} 
                          classCSSColorTxtBottom="txtColorD" 
                          texteBottom={currentArticles.DateCreation > currentArticles.DateMajnew ? new Date(currentArticles.DateCreation).toLocaleDateString('fr-FR') : new Date(currentArticles.DateMaj).toLocaleDateString('fr-FR')} 
                          key={currentArticles.CodeArticle}
                          slugArticle={currentArticles.Slug}
                          />
                      ))}
                  </>
                  }
                </div>
                <div className="row row-cols-12 g-4 mt-1">
                  {isLoading ?
                  isLargeScreen ? (
                  <>
                    <CardLargeLoading classCSSColorBackground="bgcolorC"/>
                    <CardLargeLoading classCSSColorBackground="bgcolorC"/>
                    <CardLargeLoading classCSSColorBackground="bgcolorC"/>
                  </>
                  ) : (
                    <CardLoading classCSSColorBackground="bgcolorC" tailleCol={12}/>
                  )
                  :
                  <>
                    {articles.slice(3, 999).map((currentArticles, index) => (
                      isLargeScreen ? (
                        <CardLarge classCSSColorBackground="bgcolorC" cheminImg={currentArticles.LienImg} classCSSColorTxtTitre="txtColorA" titre={currentArticles.Titre} classCSSColorTxtContenu="txtColorWhite" texteContenu={currentArticles.Resume.length >= 270 ? currentArticles.Resume.substring(0, 270) + "..." : currentArticles.Resume} classCSSColorTxtBottom="txtColorD" texteBottom={currentArticles.DateCreation > currentArticles.DateMajnew ? new Date(currentArticles.DateCreation).toLocaleDateString('fr-FR') : new Date(currentArticles.DateMaj).toLocaleDateString('fr-FR')}  key={currentArticles.CodeArticle} />
                      ) : (
                        <Card classCSSColorBackground="bgcolorC" cheminImg={currentArticles.LienImg} classCSSColorTxtTitre="txtColorA" titre={currentArticles.Titre} classCSSColorTxtContenu="txtColorWhite" texteContenu={currentArticles.Resume.length >= 170 ? currentArticles.Resume.substring(0, 170) + "..." : currentArticles.Resume} classCSSColorTxtBottom="txtColorD" texteBottom={currentArticles.DateCreation > currentArticles.DateMajnew ? new Date(currentArticles.DateCreation).toLocaleDateString('fr-FR') : new Date(currentArticles.DateMaj).toLocaleDateString('fr-FR')}  key={currentArticles.CodeArticle} />
                      )
                    ))}
                  </>
                  }
                </div>
          </div>
        </div>

        <div className="col-3 d-none d-lg-block">
          <div className="input-group mt-2 mb-1 px-3">
            <span className={`${styles.inputSearch} input-group-text ${styles.shadow}`} id="libelleInputSearchArticles">@</span>
            <input type="text" className={`${styles.inputSearch} form-control ${styles.shadow}`} placeholder="Recherche..." aria-label="rechercheArticles" aria-describedby="basic-addon1"></input>
          </div>
          <div className="p-3">
            <div className={`list-group ${styles.shadow}`}>
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
