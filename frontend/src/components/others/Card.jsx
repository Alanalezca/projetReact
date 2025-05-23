import styles from './Card.module.css';

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
            <div className="col">
                <div className={`card h-100 ${classCSSColorBackground}`}>
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
            </div>
        </>
    )
};

export default Card;