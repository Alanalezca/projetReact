import { useState } from 'react';
import styles from './ButtonPiano.module.css';

const ButtonPiano = ({arrayLibelleOccurences, currentOccurenceInFocus, setterCurrentOccurenceInFocus}) => {

    return (
        <div className={`btn-group ${styles.piano}`} role="group" aria-label="Basic outlined example">
            {arrayLibelleOccurences.map((currentOccurence, index) => (
                <button key={`btn-${index}`} type="button" className={`btn btn-outline-primary ${currentOccurenceInFocus == index && styles.selected}`} onClick={() => setterCurrentOccurenceInFocus(index)}>{currentOccurence}</button>
            ))}
        </div>
    );
}

export default ButtonPiano;

// import ButtonPiano from '../../components/others/ButtonPiano';
