import React from 'react';
import styles from './LauncherModal.module.css';

const LauncherModal = ({libelleBtn, target}) => {
    return (
        <>
            <button type="button" className="btn btn-primary btn-ColorA"  data-bs-toggle="modal" data-bs-target={`#${target}`} key={target}>
                {libelleBtn}
            </button>
        </>
    );
};

export default LauncherModal;