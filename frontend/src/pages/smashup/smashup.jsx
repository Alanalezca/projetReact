import { useState, useRef, useEffect } from 'react';
import styles from './smashup.module.css';
import Loader from '../../components/others/Loader';
import Accordeon from '../../components/others/Accordeon';
import ButtonPiano from '../../components/others/ButtonPiano';
import InputStandard from '../../components/inputs/InputStandard';

const Smashup = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const contenuPianoNbJoueurs = ['2 joueurs', '3 joueurs', '4 joueurs'];
    const [nbJoueursSelected, setNbJoueursSelected] = useState(99);
    const inputsRef = useRef({});
    const [listeBoites, setListeBoite] = useState();
    const [compteurNbFactionsSelonBoitesSelected, setCompteurNbFactionsSelonBoitesSelected] = useState(0);

    useEffect(() => {
        fetch('/api/smashup/boites')
        .then(response => response.json())
        .then(data => {
          console.log('boites', data);
          setListeBoite(data);
          setIsLoading(false);
        })
        .catch(error => console.error('Erreur fetch smashup boites:', error));
    }, [])

    useEffect(() => {
        let nbFactions = 0;
        listeBoites?.map((currentBoite) => {
            currentBoite.Selected && (nbFactions += parseInt(currentBoite.nbfactions));
        });
        setCompteurNbFactionsSelonBoitesSelected(isNaN(nbFactions) ? 0 : nbFactions);
    }, [listeBoites])

    const handleClickOnBox = (codeBoite) => {
        setListeBoite(prevListeBoites => 
            prevListeBoites?.map(prevBoite =>
                prevBoite.CodeBox === codeBoite
                ? {...prevBoite, Selected: !prevBoite?.Selected}
                : prevBoite
            ))
        console.log('boite update', listeBoites);
    };

    return (
        <div className="container-xl mt-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mt-4 text-center txtColorWhite">Smash Up : Module de draft</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mt-5">   
                    <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Un module de draft pour Smash Up ?" textMain={`Ce module permet de réaliser un draft de type <b>"Snake Draft avec bans/picks"</b> pour le jeu <b>Smash Up</b>.<br /><br />
                        Voici le déroulement :<br />
                        1. Choisir <b>le nombre de joueurs</b> participant à la partie.<br />
                        2. Sélectionner <b>les boîtes de jeu</b> qui seront utilisées.<br />
                        3. La liste des <b>factions</b> correspondant aux boîtes choisies sera alors proposée.<br />
                        4. Chaque joueur procédera ensuite à la <b>phase de pick/ban</b> dans l’ordre indiqué.<br />
                        5. Prêt à <b>jouer</b> !`}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-3 d-flex justify-content-center">
                        <h6 className="mt-4 text-center txtColorWhite">Nombre de joueurs</h6>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-2 d-flex justify-content-center">
                        <ButtonPiano arrayLibelleOccurences={contenuPianoNbJoueurs} currentOccurenceInFocus={nbJoueursSelected} setterCurrentOccurenceInFocus={setNbJoueursSelected}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-3 d-flex justify-content-center">
                        <h6 className="mt-4 text-center txtColorWhite">Pseudos</h6>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerRed)"} intMaxLength={50} strPlaceholder={"Joueur A"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoPlayerA"] = e)}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerBlue)"} intMaxLength={50} strPlaceholder={"Joueur B"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoPlayerB"] = e)}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerYellow)"} intMaxLength={50} strPlaceholder={"Joueur C"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoPlayerC"] = e)}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerGreen)"} intMaxLength={50} strPlaceholder={"Joueur D"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" ref={(e) => (inputsRef.current["pseudoPlayerD"] = e)}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-1 justify-content-center">
                        <h6 className="mt-5 text-center txtColorWhite">Sélectionnez les boites à utiliser pour le draft</h6>
                        <h6 className={`mt-2 mb-4 text-center ${compteurNbFactionsSelonBoitesSelected >= ((parseInt(nbJoueursSelected) +2) *4 +4) ? "txtColorSuccessLight" : "txtColorDangerLight"}`}>{compteurNbFactionsSelonBoitesSelected} factions sélectionnées (sur {(parseInt(nbJoueursSelected) +2) *4 +4} minimum)</h6>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-3 d-flex flex-wrap justify-content-center">
                    {listeBoites?.map((currentBoite, index) => (
                        <div key={index} className={`${styles.conteneurImgX5} me-3 mb-3`}>
                            <img src={currentBoite.LienImg} className={`rounded float-start ${styles.responsiveImgListeX5} ${currentBoite?.Selected && styles.conteneurImgSelected}`} onClick={() => handleClickOnBox(currentBoite?.CodeBox)} alt="..."></img>
                        </div>
                    ))}
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                    <button type="button" className={`btn btn-primary btn-ColorA`}>Valider la sélection</button>
                </div>
            </div>
        </div>
    );
}

export default Smashup;