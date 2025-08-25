import { useState, useEffect } from 'react';
import styles from './adminArticles.module.css';
import Loader from '../../components/others/Loader';
import { Link } from 'react-router-dom';
import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
  
const ArticlePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(0);
    const { showOngletAlerte } = useOngletAlerteContext();

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
    }, [forceRefresh]);

    const handleDeleteArticle = async (codeArticle, titreArticle) => {

    try {
        const response = await fetch("/api/articles/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ parCodeArticle: codeArticle})
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
        }

        const result = await response.json();
        showOngletAlerte('success', '(Suppression article)', '', `L'article "` + titreArticle + `" a bien été supprimé.`);
        setForceRefresh(prevForceRefresh => prevForceRefresh + 1);
    } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
    }
    };

    const handleReversePublished = async (codeArticle, titreArticle, articlePublieOuiNon) => {

    try {
        const response = await fetch("/api/articles/reverseCurrentShow", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ parCodeArticle: codeArticle})
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
        }

        const result = await response.json();
        showOngletAlerte('success', '(Publication article)', '', `L'article "` + titreArticle + `" a bien été ${articlePublieOuiNon == true ? "dépublié." : "publié."}`);
        setForceRefresh(prevForceRefresh => prevForceRefresh + 1);
    } catch (err) {
        console.error("Erreur lors de l'update du publish de l'article :", err);
    }
    };

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
                {articles.length > 0 ? (
                    articles.map((currentArticles) => (
                    <div key={currentArticles.Slug} className="row mt-1">
                        <div className="col-4">
                        <Link to={`/article/${currentArticles.Slug}`}>
                            <span className="cPointer txtColorWhiteToTxtColorB">{currentArticles?.Titre}</span>
                        </Link>
                        </div>
                        <div className="col-2">
                        <span>{new Date(currentArticles?.DateCreation).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="col-2">
                        <span>{new Date(currentArticles?.DateMaj).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="col-2">
                        {currentArticles.Publie ? 
                            <div className="d-inline"><i className="bx bx-cloud bxEnabledToDisabled topMinus3 cPointer" onClick={() => handleReversePublished(currentArticles.CodeArticle, currentArticles.Titre, currentArticles.Publie)}></i></div> :
                            <div className="d-inline"><i className="bx bx-cloud-upload bxDisabledToEnabled topMinus3 cPointer" onClick={() => handleReversePublished(currentArticles.CodeArticle, currentArticles.Titre, currentArticles.Publie)}></i></div>
                        }
                        </div>
                        <div className="col-2">
                        <Link to={`/article/create/${currentArticles.Slug}`}>
                            <div className="d-inline"><i className="bx bx-edit bxNormalOrange topMinus3 cPointer"></i></div>
                        </Link>
                            <div className="d-inline"><i className="bx bx-message-square-x bxNormalOrange topMinus3 cPointer" onClick={() => handleDeleteArticle(currentArticles.CodeArticle, currentArticles.Titre)}></i></div>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>Aucun article disponible</p>
                )}
                </div>
            </div>
        </>}
        </div>
    )
};

export default ArticlePage;