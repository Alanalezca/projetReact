import styles from './CardLargeLoading.module.css';

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
            <div className={`card h-100 d-flex flex-row ${classCSSColorBackground}`}>
              
              {/* Image à gauche, hauteur 100% */}
              <img 
                src="\images\articles\fontLoad.png"
                alt="..." 
                className={`${styles.cardImg} h-100`} 
                style={{ objectFit: 'cover', width: '25%' }} 
              />
              
              {/* Contenu à droite */}
              <div className="d-flex flex-column justify-content-between flex-grow-1">
                <div className="card-body">
                  <h5 className={`card-title ${classCSSColorTxtTitre}`}><span className="placeholder col-7"></span></h5>
                  <p className={`card-text ${classCSSColorTxtContenu}`}><span className="placeholder col-10"></span></p>
                  <p className={`card-text ${classCSSColorTxtContenu}`}><span className="placeholder col-8"></span></p>
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