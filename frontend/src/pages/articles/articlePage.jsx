import styles from './articlePage.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sanitizedHtml, setSanitizedHtml] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => setArticle(data),setIsLoading(false))
      .catch((err) => console.error('Erreur:', err));
  }, [slug]);

  useEffect(() => {
    if (article) {
        setSanitizedHtml(DOMPurify.sanitize(article[0].Contenu));
    }
  }, [article]);
  return (
    <div className="article">
      {!isLoading && article ? (
            <div className="container-xl mt-5">
                <div className="row">
                    <div className={`col-12 col-lg-10 offset-lg-1 p-0 bgcolorC ${styles.cadreTitre}`}>
                        <img src={article[0].LienImg} alt={article[0].Titre} className={styles.articleImage}/>
                        <h2 className="mt-4 text-center txtColorWhite">{article[0].Titre}</h2>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                              <i className={`bx bx-user-circle bx-sm bxNormalColorE`}></i>
                                 <span className="ps-1"><b>Article créé par : </b></span>
                              <span className="ps-1 txtColorWhite">{article[0].CreePar}</span>
                            </div>
                            <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                              <i className={`bx bx-calendar-alt bx-sm bxNormalColorE`}></i>
                              <span className="ps-1"><b>Créé le : </b></span>
                              <span className="ps-1 txtColorWhite">{new Date(article[0].DateCreation).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
                              <i className={`bx bx-calendar-edit bx-sm bxNormalColorE`}></i>
                              <span className="ps-1"><b>Der. modif. le : </b></span>
                              <span className="ps-1 txtColorWhite">{new Date(article[0].DateMaj).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                        <div className="row mt-2 mb-3">
                            <div className="col-12 d-flex align-items-center justify-content-center">
                              <i className={`bx bx-purchase-tag-alt bx-sm bxNormalColorE`}></i>
                              <span className="ps-1"><b>Tags : </b></span>
                              <span className="ps-1 txtColorWhite">{article[0].CreePar}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-10 offset-lg-1 txtColorWhite">
                            <p><i>{article.DateMaj}</i></p>
                            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                        </div>
                    </div>
                </div>
            </div>
      )
      : null}
    </div>
  );
};

export default ArticlePage;

