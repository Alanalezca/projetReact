import styles from './CardLoading.module.css';

const CardLoading = ({
    classCSSColorBackground
  }) => {

    return (
            <div className="col">
              <div className={`card h-100 ${classCSSColorBackground}`}>
                <img src="\images\articles\fontLoad.png" className={`card-img-top ${styles.cardImg}`} alt="..." />
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-12"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                  </p>
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary"><span className="placeholder col-8"></span></small>
                  </div>
                </div>
            </div>
    )
};

export default CardLoading;