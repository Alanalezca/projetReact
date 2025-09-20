import { useState } from 'react';
import styles from './Accordeon.module.css';

const Accordeon = ({textTitre, textMain, blocSoloOrTopOrMidOrBot}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`${styles.accordeonHeader} ${blocSoloOrTopOrMidOrBot == "Top" ? styles.accordeonHeaderTop : blocSoloOrTopOrMidOrBot == "Mid" ? styles.accordeonHeaderMid : blocSoloOrTopOrMidOrBot == "Bot" ? styles.accordeonHeaderBot : styles.accordeonHeaderSolo} ${isOpen && styles.open}`} onClick={() => setIsOpen(!isOpen)}>
                {textTitre}
                <i className={`bx bx-chevron-${isOpen ? "up" : "down"} ms-auto bxNormalOrange`}></i>
            </div>
            <div className={`${styles.accordeonMain} ${isOpen && styles.open} ${blocSoloOrTopOrMidOrBot == "Top" ? styles.accordeonMainTop : blocSoloOrTopOrMidOrBot == "Mid" ? styles.accordeonMainMid : blocSoloOrTopOrMidOrBot == "Bot" ? styles.accordeonMainBot : styles.accordeonMainSolo} ${isOpen && styles.open}`}>
                <span className={`${styles.textMain} ${!isOpen && styles.hidden}`}>
                {isOpen && (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: textMain }} />
                    </>
                )}
                </span>
            </div>
        </>
    );
}

export default Accordeon;

// import Accordeon from '../../components/others/Accordeon';
// <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Mon titre" textMain={`Texte<br /><br />/>

// textTitre -> Texte à afficher dans le volet supérieur (titre)
// textMain -> HTML à afficher dans le volet inférieur
// blocSoloOrTopOrMidOrBot -> "Solo" affiche un accordeon isolé, "Top"/"Mid"/"Bot" permet d'afficher un élément accordeon top/mid ou bot (pour une liste)