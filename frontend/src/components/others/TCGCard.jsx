import { useState } from 'react';
import styles from './TCGCard.module.css';

const TCGCard = ({nomCarte, imageCarte, rareteCarte, handleClicValiderCarte, isLoading}) => {

    return (
        <div className={`${styles.cardWrapper} ${isLoading ? styles.cardWrapperIsLoading : ''} ${styles[rareteCarte]}`}>
            <img src={imageCarte ? imageCarte : "/images/keyforge/Set1/NC.png"} alt={nomCarte} className={styles.cardImage} onClick={handleClicValiderCarte}/>
        </div>
    );
}

export default TCGCard;