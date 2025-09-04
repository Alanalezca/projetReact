import styles from './articlePage.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
import { Link } from 'react-router-dom';
import { handleDeleteArticle } from '../../functions/callAPIx/articleDelete';
import { handleReversePublished } from '../../functions/callAPIx/articleReversePublish';
import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
import Loader from '../../components/others/Loader';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [articleNotExist, setArticleNotExist] = useState(false);
  const vueDejaComptee = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sanitizedHtml, setSanitizedHtml] = useState(null);
  const { sessionUser } = useSessionUserContext();
  const { showOngletAlerte } = useOngletAlerteContext();
  const [forceRefresh, setForceRefresh] = useState(0);

  const splitTags = (tagsString) => {
    if (typeof tagsString === 'string' && tagsString.trim() !== '') {
      return tagsString.split(',').map(tag => tag.trim());
    }
    return [];
  };


  const fetchArticleIncNbVues = async (codeArticle) => {

      try {
        const response = await fetch("/api/articles/incrementViewArticle", {
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
    } catch (err) {
        console.error("Erreur lors de l'incrémentation du nombre de vues de l'article :", err);
    }
  };

useEffect(() => {
  setIsLoading(true);
  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${slug}`);

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (data && Array.isArray(data) && data.length > 0) {
        const dataModify = data;
        dataModify[0].Tags = splitTags(data[0].Tags);
        setArticle(dataModify);
        setArticleNotExist(!dataModify[0].CodeArticle);
        if (!vueDejaComptee.current) {
          fetchArticleIncNbVues(data[0]?.CodeArticle);
          vueDejaComptee.current = true;
        } 
      } else {
        setArticle(null);
        setArticleNotExist(true);
      }

    } catch (err) {
      console.error('Erreur fetch article:', err);
      setArticle(null);
      setArticleNotExist(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (slug) {
    fetchArticle();
  };
}, [slug, forceRefresh]);

  useEffect(() => {
    if (article) {
        setSanitizedHtml(DOMPurify.sanitize(article[0].Contenu));
    }
  }, [article]);
  console.log(article);
  return (
    <div className="article">
      {isLoading && (
        <>
          <Loader/>
        </>) 
      }
      {article && (
            <>
              <div className="container-xl mt-5">
                  <div className="row">
                      <div className={`col-12 col-lg-10 offset-lg-1 p-0 bgcolorC ${styles.cadreTitre} ${styles.shadow}`}>
                          <img src={article[0].LienImg} alt={article[0].Titre} className={styles.articleImage}/>
                          <h2 className="mt-4 text-center txtColorWhite">{article[0].Titre}</h2>
                          <div className="row mt-4">
                              <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                                <i className={`bx bx-user-circle bx-sm bxNormalColorE`}></i>
                                  <span className="ps-1"><b>Article créé par : </b></span>
                                <span className="ps-1 txtColorWhite">{article[0].PseudoCreateur}</span>
                              </div>
                              <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                                <i className={`bx bx-calendar-alt bx-sm bxNormalColorE`}></i>
                                <span className="ps-1"><b>Créé le : </b></span>
                                <span className="ps-1 txtColorWhite">{new Date(article[0].DateCreation).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                                <i className={`bx bx-calendar-edit bx-sm bxNormalColorE`}></i>
                                <span className="ps-1"><b>Édité le : </b></span>
                                <span className="ps-1 txtColorWhite">{new Date(article[0].DateMaj).toLocaleDateString('fr-FR')}</span>
                              </div>
                          </div>
                          <div className="row mt-2 mb-3">
                              <div className="col-12 d-flex align-items-center justify-content-center">
                                <i className={`bx bx-book-reader bx-sm bxNormalColorE`}></i>
                                <span className="ps-1"><b>Vues : </b></span>
                                <span className="ps-1 me-2 txtColorWhite">{article[0].NbVues}</span>
                                <i className={`bx bx-purchase-tag-alt bx-sm bxNormalColorE`}></i>
                                <span className="ps-1"><b>Tags : </b></span>
                                {article[0].Tags && article[0].Tags.map((currentTag, index) => (
                                  <div className="ps-2" key={`tag-` + index}><span className="badge badge-custom">{currentTag}</span></div>
                                ))}
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="mb-5 col-12 col-lg-10 offset-lg-1 txtColorWhite">
                            {/* Mini menu admin */}
                            {sessionUser?.grade === "Administrateur" ? 
                            <div className={styles.ancrageOverlayCommandesAdmin}>
                              <div className={styles.overlayCommandesAdmin}>
                                <Link to={`/article/create/${article[0].Slug}`}><i className={`bx bx-edit bxNormalOrange cPointer`}></i></Link>
                                <i className={`bx bx-trash bxNormalOrangeToRed ps-1 cPointer`} onClick={() => handleDeleteArticle(article[0].CodeArticle, article[0].Titre, showOngletAlerte, setForceRefresh)}></i>
                              {article[0].Publie === true ? 
                                    <i className={`bx bxs-cloud bxEnabledToDisabled topMinus3  cPointer`} onClick={() => {handleReversePublished(article[0].CodeArticle, article[0].Titre, article[0].Publie, showOngletAlerte, null); 
                                      setArticle(prev => {
                                        const updated = [...prev];
                                        updated[0] = { ...prev[0], Publie: !prev[0].Publie};
                                        return updated;
                                        }
                                      );}}>
                                    </i>
                                  :
                                    <i className={`bx bxs-cloud-upload bxDisabledToEnabled topMinus3 cPointer`} onClick={() => {handleReversePublished(article[0].CodeArticle, article[0].Titre, article[0].Publie, showOngletAlerte, null); 
                                      setArticle(prev => {
                                        const updated = [...prev];
                                        updated[0] = { ...prev[0], Publie: !prev[0].Publie};
                                        return updated;
                                        }
                                      );}}>
                                    </i>
                                  }
                              </div>
                            </div>
                            : null}
                              <div className="mt-4" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                          </div>
                      </div>
                  </div>
              </div>
              <div id={styles.btnGoTop} className="btn-ColorA" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className={`bx bxs-up-arrow bx-sm`}></i>
              </div>
            </>
      )}
      {articleNotExist && !isLoading && (
            <div className="container-xl mt-5">
              <div className="row d-flex align-items-center">
                  <div className="col-12 mt-3 text-center">
                    <p>Aucun article disponible</p>
                  </div>
              </div>
            </div>
      )}
    </div>
  );
};

export default ArticlePage;

