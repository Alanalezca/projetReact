import styles from './CardLarge.module.css';

const Card = ({
    classCSSColorBackground,
    cheminImg,
    classCSSColorTxtTitre,
    titre,
    classCSSColorTxtContenu,
    texteContenu,
    classCSSColorTxtBottom,
    texteBottom
}) => {

    return (
        <>
          <div className="col-12">
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
                    <span className={classCSSColorTxtBottom}>{texteBottom}</span>
                  </small>
                </div>
              </div>

            </div>
          </div>
        </>
    )
};

export default Card;