import styles from './CardLarge.module.css';
import { useState, useEffect } from  'react';
import { Link } from 'react-router-dom';

const Card = ({
    classCSSColorBackground,
    cheminImg,
    classCSSColorTxtTitre,
    titre,
    classCSSColorTxtContenu,
    texteContenu,
    classCSSColorTxtBottom,
    texteBottom,
    tags,
    slugArticle
}) => {

    const [tagsArray, setTagsArray] = useState([]);

    useEffect(() => {
      setTagsArray(tags?.split(","));
    }, []);

    return (
        <>
          <div className="col-12">
            <Link to={`/article/${slugArticle}`}>
              <div className={`card h-100 d-flex flex-row ${classCSSColorBackground} ${styles.shadow}`}>
                
                {/* Image à gauche, hauteur 100% */}
                <img 
                  src={cheminImg} 
                  alt="..." 
                  className={`${styles.cardImg} h-100`} 
                  style={{ objectFit: 'cover', width: '75%' }} 
                />
                
                {/* Contenu à droite */}
                <div className="d-flex flex-column justify-content-between flex-grow-1">
                  <div className="card-body">
                    <h5 className={`card-title ${classCSSColorTxtTitre}`}>{titre}</h5>
                    <p className={`card-text ${classCSSColorTxtContenu}`}>{texteContenu}</p>
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary">
                      <span className={classCSSColorTxtBottom}>
                        {texteBottom}
                        <div className="ps-2 d-inline-block">
                          {tagsArray?.map((currentTag, index) => (
                            <div className="d-inline-block me-1" key={currentTag}><span className="badge badge-custom">{currentTag}</span></div>
                          ))}
                        </div>
                      </span>
                    </small>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        </>
    )
};

export default Card;