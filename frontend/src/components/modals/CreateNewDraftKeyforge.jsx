import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useSessionUserContext } from '../contexts/sessionUserContext';
import { useOngletAlerteContext } from '../contexts/ToastContext';
import styles from './CreateNewDraftKeyforge.module.css';
import FloatingLabel from '../inputs/FloatingInput';
import convertDateToDateLong from '../../functions/getDateLong';
import InputStandard from '../../components/inputs/InputStandard';

  const FormNewDraftKeyforge = ({ handleClose, show, handleRefresh}) => {
    const { showOngletAlerte } = useOngletAlerteContext();
    const {sessionUser, setSessionUser} = useSessionUserContext();
    const inputsRef = useRef({});
    const [idSetSelected, setIDSetSelected] = useState();
    const [unlockBtnValiderCreateNewDraft, setUnlockBtnValiderCreateNewDraft] = useState(false);

    const [listeSets, setListeSets] = useState();
        useEffect(() => {
        fetch('/api/keyforge/sets')
        .then(response => response.json())
        .then(data => {
          setListeSets(data);
        }).catch(error => console.error('Erreur fetch dice throne sets:', error));
    }, []);

    const handleClickOnSet = (codeSet) => {
        setListeSets(prevListeSets =>
            prevListeSets?.map(currentSet =>
                currentSet.ID === codeSet
                    ? { 
                        ...currentSet,
                        Selected: true
                    }
                    :   {                    
                        ...currentSet,
                        Selected: false
                    }
            )
        );
        setIDSetSelected(codeSet);
        setUnlockBtnValiderCreateNewDraft(true);
    };

    const handleCreateNewDraft = async () => {
        const dateNow = new Date();
        const dateFormated = convertDateToDateLong(dateNow);
        try {
        const response = await fetch("/api/keyforge/creationNewDraft", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ parID: (sessionUser.id.toString() + "-" + dateFormated), parJoueurA: inputsRef?.current["pseudoJoueurA"]?.value, parJoueurB: inputsRef?.current["pseudoJoueurB"]?.value, parPresenceAnomalies: inputsRef?.current["checkAvecAnomalies"]?.value, parSet: idSetSelected, parDateCreation: dateNow, parDateMaj: dateNow, parCreePar: sessionUser.id, parTitreDraft: inputsRef?.current["titreDraft"]?.value, parEtat: 0})
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
        }

        const result = await response.json();
        showOngletAlerte('success', '(Création draft)', '', `Le nouveau draft KeyForge "` + inputsRef?.current["titreDraft"]?.value + `" a bien été créé !`);
        handleClose(false);
        setListeSets(prevListeSets =>
            prevListeSets?.map(currentSet => ({
                ...currentSet,
                Selected: false
            }))
        );
        setUnlockBtnValiderCreateNewDraft(false);
        handleRefresh(prev => prev +1);
        setIDSetSelected();
        } catch (err) {
        console.error("Erreur lors de la création du draft KeyForge :", err);
        }
    };

  return (
    <Modal show={show} onHide={() => handleClose(false)} centered>
      <Modal.Header closeButton className={`${styles.borderTop} bgcolorC modalTopBordBotTransparent`}>
        <Modal.Title className="txtColorWhite">Création d'un nouveau draft</Modal.Title>
      </Modal.Header>

      <Modal.Body className={`bgcolorC ${styles.borderMid}`}>
            <div id="formCreateNewDraft">
                <div className="row">             
                    <div className="col-12 mt-3 d-flex justify-content-center">
                            <h6 className="text-center txtColorWhite">Nom du draft</h6>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 mt-2 d-flex justify-content-center">
                        <InputStandard strType={"text"} intMaxLength={40} strPlaceholder={"Nom du draft"} strValeurByDef={""} strID={"titreDraft"} strTxtAlign="center" ref={(e) => (inputsRef.current["titreDraft"] = e)}/>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 mt-4 d-flex justify-content-center">
                        <h6 className="text-center txtColorWhite">Pseudos</h6>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                        <InputStandard strType={"text"} strColor={"var(--txtColorPlayerRed)"} intMaxLength={50} strPlaceholder={"Joueur A"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoJoueurA"] = e)}/>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                        <InputStandard strType={"text"} strColor={"var(--txtColorPlayerBlue)"} intMaxLength={50} strPlaceholder={"Joueur B"} strValeurByDef={""} strID={"pseudoJoueurB"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoJoueurB"] = e)}/>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 mt-3 d-flex justify-content-center">
                        <h6 className="mt-4 text-center txtColorWhite">Sélectionnez un set...</h6>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 d-flex justify-content-center">
                        <div className="p-3">
                            <div className={`list-group ${styles.shadow}`}>
                                {listeSets?.map((current, index) => (
                                    <button type="button" key={index} className={`list-group-item list-group-item-action text-center ${!current.Selected ? styles.bandeauTag : styles.bandeauTagFocus}`} onClick={() => handleClickOnSet(current.ID)}>Set {current.Numero} : {current.Libelle}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 mt-3 d-flex justify-content-center">
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="checkAvecAnomalies" ref={(e) => (inputsRef.current["checkAvecAnomalies"] = e)}></input>
                            <label class="form-check-label txtColorWhite" for="checkAvecAnomalies">Inclure la possibilité d'anomalies</label>
                        </div>
                    </div>
                </div>
            </div>
      </Modal.Body>

      <Modal.Footer className={`${styles.LoginModalBot} ${styles.borderBottom}`}>         
            <div className="col-12 d-flex justify-content-center">
                <Button disabled={!unlockBtnValiderCreateNewDraft} className={`btn btn-primary ${unlockBtnValiderCreateNewDraft ? "btn-ColorA" : "btn-ColorInactif"}`} onClick={() => handleCreateNewDraft()}>
                    Créer le draft
                </Button>
            </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FormNewDraftKeyforge;