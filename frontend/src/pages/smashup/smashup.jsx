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
    const [currentEtapeDraft, setCurrentEtapeDraft] = useState(0);
    const [nbJoueursSelected, setNbJoueursSelected] = useState(0);
    const inputsRef = useRef({});
    const [listeBoites, setListeBoite] = useState();
    const [listeFactions, setListeFactions] = useState();
    const [compteurNbFactionsSelonBoitesSelected, setCompteurNbFactionsSelonBoitesSelected] = useState(0);
    const [namePlayers, setNamePlayers] = useState([
        { J1: "Joueur A", J2: "Joueur B", J3: "Joueur C", J4: "Joueur D" }
    ]);
    const [factionsPickBanByPlayer, setFactionsPickBanByPlayer] = useState([
        { ID: 1, FactionBanA: "-", FactionBanB: "-", FactionPickA: "-", FactionPickB: "-" },
        { ID: 2, FactionBanA: "-", FactionBanB: "-", FactionPickA: "-", FactionPickB: "-" },
        { ID: 3, FactionBanA: "-", FactionBanB: "-", FactionPickA: "-", FactionPickB: "-" },
        { ID: 4, FactionBanA: "-", FactionBanB: "-", FactionPickA: "-", FactionPickB: "-" }
    ]);
    const [showOverlayFactions, setShowOverlayFactions] = useState(false);
    const [txtCurrentInstruction, setTxtCurrentInstruction] = useState("XXX");
    const [txtCurrentInstructionColor, setTxtCurrentInstructionColor] = useState("XXX");
    const [txtCurrentPlayer, setTxtCurrentPlayer] = useState("XXX");
    const [txtCurrentPlayerColor, setTxtCurrentPlayerColor] = useState("XXX");
    const [phasePickOrBan, setPhasePickOrBan] = useState("");
    const [draftTermine, setDraftTermine] = useState(false);

    useEffect(() => {
        if (nbJoueursSelected === 0) {
            if ([2, 3, 6, 7].includes(currentEtapeDraft)) {
                setPhasePickOrBan("Ban");
            } else {
                setPhasePickOrBan("Pick");
            }
        }
    }, [currentEtapeDraft])

    useEffect(() => {
        fetch('/api/smashup/boites')
        .then(response => response.json())
        .then(data => {
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

    const handleBuildFiltreFactions = (boxes) => {
        let filtreFactions = "";
        boxes?.map((currentBox, index) => {
            currentBox?.Selected && (filtreFactions += (filtreFactions !== "" ? "$" : "") + currentBox?.CodeBox);
        });
        getFactionsFromBoxesSelected(filtreFactions);
    };

    const getFactionsFromBoxesSelected = (filtre) => {
        fetch('/api/smashup/factions?filtreBoxes=' + filtre)
        .then(response => response.json())
        .then(data => {
          setListeFactions(data);
        })
        .catch(error => console.error('Erreur fetch smashup factions:', error));
    };

    const handleClickOnBox = (codeBoite) => {
        setListeBoite(prevListeBoites => 
            prevListeBoites?.map(prevBoite =>
                prevBoite.CodeBox === codeBoite
                ? {...prevBoite, 
                    Selected: !prevBoite?.Selected}
                : prevBoite
            ))
    };

    const handleClickOnFaction = (codeFaction, libelleFaction, selectedOrNot) => {
        if (selectedOrNot || (nbJoueursSelected == 0 && currentEtapeDraft > 9)) {
            return;
        }
        setListeFactions(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
                prevFaction.CodeFaction === codeFaction
                ? {...prevFaction, 
                    Selected: true,
                    TypeSelected: phasePickOrBan}
                : prevFaction
            ));
        
        if(nbJoueursSelected == 0) {
        switch (currentEtapeDraft) {
            case 2:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        FactionBanA: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 3:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        FactionBanA: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 4:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        FactionPickA: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 5:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        FactionPickA: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 6:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        FactionBanB: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 7:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        FactionBanB: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 8:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        FactionPickB: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                break;
            case 9:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                setFactionsPickBanByPlayer(prevFactionsPickBanByPlayer => 
                    prevFactionsPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        FactionPickB: libelleFaction}
                    : draftFromCurrentPlayer
                ));
                setDraftTermine(true);
                break;
            }
        }
        setCurrentEtapeDraft(prev => prev + 1);
    };

    const handleLoadNamePlayers = () => {
        setNamePlayers((prev) =>({
            ...prev,
            J1: inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A",
            J2: inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B",
            J3: inputsRef?.current["pseudoPlayerC"]?.value || "Joueur C",
            J4: inputsRef?.current["pseudoPlayerD"]?.value || "Joueur D"
        }));
    };

    useEffect(() => {
        handleLoadTxtCurrentInstruction();
        handleLoadTxtPlayer();
        handleLoadColorPlayer();
        handleLoadColorInstruction();
    }, [currentEtapeDraft])

    const handleLoadTxtCurrentInstruction = () => {
        if(nbJoueursSelected == 0) {
            switch (currentEtapeDraft) {
            case 2:
                setTxtCurrentInstruction("doit BANNIR une faction");
                break;
            case 3:
                setTxtCurrentInstruction("doit BANNIR une faction");
                break;
            case 4:
                setTxtCurrentInstruction("doit SELECTIONNER sa première faction");
                break;
            case 5:
                setTxtCurrentInstruction("doit SELECTIONNER sa première faction");
                break;
            case 6:
                setTxtCurrentInstruction("doit BANNIR une faction");
                break;
            case 7:
                setTxtCurrentInstruction("doit BANNIR une faction");
                break;
            case 8:
                setTxtCurrentInstruction("doit SELECTIONNER sa seconde faction");
                break;
            case 9:
                setTxtCurrentInstruction("doit SELECTIONNER sa seconde faction");
                break;
            }
        } 
    };

    const handleLoadTxtPlayer = () => {
        if(nbJoueursSelected == 0) {
            switch (currentEtapeDraft) {
            case 2:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                break;
            case 3:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                break;
            case 4:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                break;
            case 5:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                break;
            case 6:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                break;
            case 7:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                break;
            case 8:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                break;
            case 9:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                break;
            }
        } 
    };

    const handleLoadColorPlayer = () => {
        if(nbJoueursSelected == 0) {
            switch (currentEtapeDraft) {
            case 2:
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                break;
            case 3:
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                break;
            case 4:
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                break;
            case 5:
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                break;
            case 6:
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                break;
            case 7:
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                break;
            case 8:
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                break;
            case 9:
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                break;
            }
        } 
    };

    const handleLoadColorInstruction = () => {
        if(nbJoueursSelected == 0) {
            switch (currentEtapeDraft) {
            case 2:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                break;
            case 3:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                break;
            case 4:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                break;
            case 5:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                break;
            case 6:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                break;
            case 7:
                setTxtCurrentInstructionColor("txtColorPlayerRed");
                break;
            case 8:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                break;
            case 9:
                setTxtCurrentInstructionColor("txtColorPlayerGreen");
                break;
            }
        } 
    };
    console.log(phasePickOrBan);
    console.log(listeFactions);
    console.log(currentEtapeDraft);
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
                        <ButtonPiano arrayLibelleOccurences={contenuPianoNbJoueurs} currentOccurenceInFocus={nbJoueursSelected} setterCurrentOccurenceInFocus={currentEtapeDraft === 0 ? setNbJoueursSelected : undefined}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 mt-3 d-flex justify-content-center">
                        <h6 className="mt-4 text-center txtColorWhite">Pseudos</h6>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerRed)"} intMaxLength={50} strPlaceholder={"Joueur A"} strValeurByDef={""} strID={"pseudoJoueurA"} strTxtAlign="center" disabled={currentEtapeDraft > 0 && true} ref={(e) => (inputsRef.current["pseudoPlayerA"] = e)}/>
                </div>
            </div>
            <div className="row">             
                <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                    <InputStandard strType={"text"} strColor={"var(--txtColorPlayerBlue)"} intMaxLength={50} strPlaceholder={"Joueur B"} strValeurByDef={""} strID={"pseudoJoueurB"} strTxtAlign="center" disabled={currentEtapeDraft > 0 && true} ref={(e) => (inputsRef.current["pseudoPlayerB"] = e)}/>
                </div>
            </div>
            {nbJoueursSelected > 0 &&
                <div className="row">             
                    <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                        <InputStandard strType={"text"} strColor={"var(--txtColorPlayerYellow)"} intMaxLength={50} strPlaceholder={"Joueur C"} strValeurByDef={""} strID={"pseudoJoueurC"} strTxtAlign="center" disabled={currentEtapeDraft > 0 && true} ref={(e) => (inputsRef.current["pseudoPlayerC"] = e)}/>
                    </div>
                </div>
            }
            {nbJoueursSelected > 1 &&
                <div className="row">             
                    <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                        <InputStandard strType={"text"} strColor={"var(--txtColorPlayerGreen)"} intMaxLength={50} strPlaceholder={"Joueur D"} strValeurByDef={""} strID={"pseudoJoueurD"} strTxtAlign="center" disabled={currentEtapeDraft > 0 && true} ref={(e) => (inputsRef.current["pseudoPlayerD"] = e)}/>
                    </div>
                </div>
            }
            {currentEtapeDraft == 0 &&
            <div className="row">             
                <div className="col-12 mt-5 mb-5 d-flex justify-content-center">
                    <button type="button" className={`btn btn-primary btn-ColorA`} onClick={() => setCurrentEtapeDraft(1)}>Valider le nombre de joueurs</button>
                </div>
            </div>
            }

            {currentEtapeDraft == 1 &&
            <>
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
                                <img src={currentBoite.LienImg} className={`rounded float-start ${styles.responsiveImgListeX5} ${currentBoite?.Selected && styles.conteneurImgSelected}`} onDoubleClick={() => handleClickOnBox(currentBoite?.CodeBox)} alt="..."></img>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="row mb-5">           
                    <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                        <button type="button" disabled={compteurNbFactionsSelonBoitesSelected < ((parseInt(nbJoueursSelected) +2) *4 +4)} className={`btn btn-primary ${compteurNbFactionsSelonBoitesSelected >= ((parseInt(nbJoueursSelected) +2) *4 +4) ? "btn-ColorA" : "btn-ColorInactif"}`} onClick={() => {handleBuildFiltreFactions(listeBoites); setCurrentEtapeDraft(2); handleLoadNamePlayers();}}>Valider les sets sélectionnés</button>
                    </div>
                </div>
            </>
            }

            {currentEtapeDraft >= 2 && 

            <>
                <div className="row">             
                    <div className="col-12 mt-3 d-flex justify-content-center">
                            <h6 className="mt-4 text-center txtColorWhite">Le draft porte sur les sets suivants :</h6>
                    </div>
                </div>
                <div className="row">             
                    <div className="col-12 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                        <ul className="list-group">
                            {listeBoites?.map((currentBoite, index) => (
                                currentBoite.Selected == true &&
                                    <li key={"boxResume-" + index} className="list-group-item static">{currentBoite.Libelle}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-12 mt-4 d-flex justify-content-center">
                            {!draftTermine ?
                                <h5 className={`text-center ${txtCurrentPlayerColor}`}>{txtCurrentPlayer}</h5>
                                :
                                <h6 className={`text-center txtColorWhite`}>Le draft est à présent terminé !</h6>
                            }
                    </div>          
                    <div className="col-12 d-flex justify-content-center">
                            {!draftTermine &&
                                <h6 className={`text-center ${txtCurrentInstructionColor}`}>{txtCurrentInstruction}</h6>
                            }
                    </div>
                </div>

                {!draftTermine && 
                <>
                    <div className="row">
                        <div className="col-12 mt-2 d-flex justify-content-center">
                                {showOverlayFactions ? 
                                    <i className={`bx bx-image-alt bxNormalOrange`} onClick={() => setShowOverlayFactions(false)}></i> :
                                    <i className={`bx bx-detail bxNormalOrange`} onClick={() => setShowOverlayFactions(true)}></i>
                                }
                        </div>
                    </div>


                    <div className="row">        
                        <div className="col-12 mt-4 d-flex flex-wrap justify-content-center">
                            {listeFactions?.map((currentFaction, index) => (
                                <div key={"faction-" + index} className={`${styles.conteneurImgX5} ${phasePickOrBan == "Pick" && styles.toPick} ${phasePickOrBan == "Ban" && styles.toBan} ${currentFaction.TypeSelected == "Pick" ? styles.factionPicked : (currentFaction.TypeSelected == "Ban" ? styles.factionBanned : "")} me-3 mb-3`}>
                                    <div className={`${styles.blocFaction} ${currentFaction?.Selected && styles.grayscale}`}>
                                        <img src={currentFaction.LienImg} className={`rounded float-start ${styles.responsiveImgFaction}`} onDoubleClick={() => handleClickOnFaction(currentFaction?.CodeFaction, currentFaction?.Libelle, currentFaction?.Selected)} alt="..."></img>
                                    </div>
                                    <div className={`${styles.overlayText} ${showOverlayFactions && styles.show}`} onDoubleClick={() => handleClickOnFaction(currentFaction?.CodeFaction, currentFaction?.Libelle, currentFaction?.Selected)}>
                                        {currentFaction.Libelle}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
                }

                <div className="row">             
                    <div className="col-12 mt-3 mb-3 d-flex justify-content-center">
                            <h4 className="text-center txtColorWhite">Résultat du draft</h4>
                    </div>
                </div>

                <div className="row mb-5">             
                    <div className="col-12 col-lg-6 mt-2 mb-3 d-flex justify-content-center">
                        <ul className="list-group w-100 text-center">
                            <li className="list-group-item staticHeader">{namePlayers.J1}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[0].FactionBanA}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[0].FactionBanB}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[0].FactionPickA}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[0].FactionPickB}</li>
                        </ul>
                    </div>
                    <div className="col-12 col-lg-6 mt-2 mb-3 d-flex justify-content-center">
                        <ul className="list-group w-100 text-center">
                            <li className="list-group-item staticHeader">{namePlayers.J2}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[1].FactionBanA}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[1].FactionBanB}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[1].FactionPickA}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[1].FactionPickB}</li>
                        </ul>
                    </div>
                    {nbJoueursSelected >= 1 && 
                    <div className="col-12 col-lg-6 mt-2 d-flex justify-content-center">
                        <ul className="list-group w-100 text-center">
                            <li className="list-group-item staticHeader">{namePlayers.J3}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[2].FactionBanA}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[2].FactionBanB}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[2].FactionPickA}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[2].FactionPickB}</li>
                        </ul>
                    </div>
                    }
                    {nbJoueursSelected >= 2 && 
                    <div className="col-12 col-lg-6 mt-2 d-flex justify-content-center">
                        <ul className="list-group w-100 text-center">
                            <li className="list-group-item staticHeader">{namePlayers.J4}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[3].FactionBanA}</li>
                            <li className="list-group-item staticRed">{factionsPickBanByPlayer[3].FactionBanB}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[3].FactionPickA}</li>
                            <li className="list-group-item staticGreen">{factionsPickBanByPlayer[3].FactionPickB}</li>
                        </ul>
                    </div>
                    }
                    <div id={styles.btnRollBack} className="btn-ColorA" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <i className={`bx bxs-eraser bx-sm`}></i>
                    </div>
                </div>
            </>
            }
        </div>
    );
}

export default Smashup;