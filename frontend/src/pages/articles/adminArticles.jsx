import { useState, useEffect } from 'react';
import styles from './adminArticles.module.css';
import Loader from '../../components/others/Loader';
import { Link } from 'react-router-dom';
  
const ArticlePage = () => {
const [isLoading, setIsLoading] = useState(true);
const [isLargeScreen, setIsLargeScreen] = useState(false);
const [articles, setArticles] = useState([]);
useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 992);
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
}, []);

useEffect(() => {
    fetch('/api/articles/all')
    .then(response => response.json())
    .then(data => {
      setArticles(data);
      setIsLoading(false);
    })
    .catch(error => console.error('Erreur fetch articles:', error));
}, []);

    console.log(articles);
    return (
        //<div className="container-xl mt-4">{isLargeScreen ? "large" : "pas large"}
        <div className={`container-xl mt-4 ${!isLoading && "txtColorWhite"}`}>
            {isLoading ?
            <Loader/> : <>
            <div className="row">
                <div className="col-12 mt-4">
                    <div className="row">
                        <div className="col-4">
                            <b>Titre</b>
                        </div>
                        <div className="col-2">
                            <b>Date création</b>
                        </div>
                        <div className="col-2">
                            <b>Date màj</b>
                        </div>
                        <div className="col-2">
                            <b>Publié</b>
                        </div>
                        <div className="col-2">
                        
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.breakerTitre} mt-3`}></div>
            <div className="row d-flex align-items-center">
                <div className="col-12 mt-3">
                    {articles.map((currentArticles, index) => (
                        <div className="row mt-1">
                        <div className="col-4">
                            <Link to={`/article/${currentArticles.Slug}`}><span className="cPointer txtColorWhiteToTxtColorB">{currentArticles?.Titre}</span></Link>
                        </div>
                        <div className="col-2">
                            <span>{new Date(currentArticles?.DateCreation).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="col-2">
                            <span>{new Date(currentArticles?.DateMaj).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="col-2">
                            {currentArticles.Publie ? 
                            <div className="d-inline"><i className={`bx bx-cloud bxEnabledToDisabled topMinus3  cPointer`}></i></div>
                            :
                            <div className="d-inline"><i className={`bx bx-cloud-upload bxDisabledToEnabled topMinus3 cPointer`}></i></div>
                            }
                        </div>
                        <div className="col-2 ">
                            <Link to={`/article/create/${currentArticles.Slug}`}><div className="d-inline"><i className={`bx bx-edit bxNormalOrange topMinus3 cPointer`}></i></div></Link>
                            <div className="d-inline"><i className={`bx bx-message-square-x bxNormalOrange topMinus3 cPointer`}></i></div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>}
        </div>
    )
};

export default ArticlePage;