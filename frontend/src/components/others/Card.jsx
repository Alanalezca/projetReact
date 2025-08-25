import styles from './Card.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from  'react';

const Card = ({
    classCSSColorBackground,
    cheminImg,
    classCSSColorTxtTitre,
    titre,
    classCSSColorTxtContenu,
    texteContenu,
    classCSSColorTxtBottom,
    texteBottom,
    tailleCol,
    slugArticle,
    tags
}) => {

      const [tagsArray, setTagsArray] = useState([]);

    useEffect(() => {
      setTagsArray(tags?.split(","));
    }, []);

    return (
            <div className={`col-${tailleCol} text-center`}>
              <Link to={`/article/${slugArticle}`}>
                <div className={`card h-100 ${classCSSColorBackground} ${styles.shadow}`}>
                  <img src={cheminImg} className={`card-img-top ${styles.cardImg}`} alt="..." />
                  <div className="card-body">
                    <h5 className={`card-title ${classCSSColorTxtTitre}`}>{titre}</h5>
                    <p className={`card-text ${classCSSColorTxtContenu}`}>
                      {texteContenu}
                    </p>
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary"><span className={classCSSColorTxtBottom}>{texteBottom}</span></small>
                      <div className="ps-2 d-inline-block">
                        {tagsArray?.map((currentTag, index) => (
                          <div className="d-inline-block me-1" key={currentTag}><span className="badge badge-custom">{currentTag}</span></div>
                        ))}
                      </div>
                  </div>
                </div>
              </Link>
            </div>
    )
};

export default Card;