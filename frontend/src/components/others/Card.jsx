import styles from './Card.module.css';
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
    tailleCol,
    slugArticle
}) => {

    return (
            <div className={`col-${tailleCol}`}>
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
                  </div>
                </div>
              </Link>
            </div>
    )
};

export default Card;