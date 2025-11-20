import { useState, useRef, useEffect } from 'react';
import styles from './dicethrone.module.css';
import Loader from '../../components/others/Loader';
import Accordeon from '../../components/others/Accordeon';
import InputStandard from '../../components/inputs/InputStandard';

const DiceThroneDrafter = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentEtapeDraft, setCurrentEtapeDraft] = useState(0);
    const inputsRef = useRef({});
    const [listeBoites, setListeBoite] = useState();
    const [listeSets, setListeSets] = useState();
    const [listeHeros, setListeHeros] = useState();
    const [modeSelectByDoubleClic, setModeSelectByDoubleClic] = useState(false);
    const [phasePickOrBan, setPhasePickOrBan] = useState("Pick");
    const [showOverlayHeros, setShowOverlayHeros] = useState(false);
    const [draftTermine, setDraftTermine] = useState(false);
    const [filtreOnAllBoxes, setFiltreOnAllBoxes] = useState(true);
    const [namePlayers, setNamePlayers] = useState([
        { J1: "Joueur A", J2: "Joueur B"}
    ]);
    const [herosPickBanByPlayer, setHerosPickBanByPlayer] = useState([
        { ID: 1, HerosPickA: null, LibelleHerosPickA: "", HerosPickB: null, LibelleHerosPickB: "", HerosPickC: null, LibelleHerosPickC: "", IndiceHerosBan: null, IndiceHerosSelectedFinal: null },
        { ID: 2, HerosPickA: null, LibelleHerosPickA: "", HerosPickB: null, LibelleHerosPickB: "", HerosPickC: null, LibelleHerosPickC: "", IndiceHerosBan: null, IndiceHerosSelectedFinal: null }
    ]);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [txtCurrentPlayer, setTxtCurrentPlayer] = useState("XXX");
    const [txtCurrentPlayerColor, setTxtCurrentPlayerColor] = useState("XXX");
    const [txtCurrentInstruction, setTxtCurrentInstruction] = useState("XXX");
    const [txtCurrentInstructionColor, setTxtCurrentInstructionColor] = useState("XXX");
    const [lastHerosSaisieForRollback, setLastHerosSaisieForRollback] = useState({codeHeros: null, libelleHeros: null});
    const [compteurNbHerosSelonBoitesSelected, setCompteurNbHerosSelonBoitesSelected] = useState(0);
    const [indiceJoueurViewedPourBan, setIndiceJoueurViewedPourBan] = useState(0);

    useEffect(() => {
    document.querySelectorAll('.noFocus').forEach(el => el.blur());
    }, []);

    useEffect(() => {
        fetch('/api/dicethrone/boites')
        .then(response => response.json())
        .then(data => {
          setListeBoite(data);
          setIsLoading(false);
          const vaguesGroup = [...new Set(data.map(item => item.Vague))];
          setListeSets(vaguesGroup.map(v => ({ Numero: v })));
        })
        .catch(error => console.error('Erreur fetch dice throne boites:', error));
    }, [])

    useEffect(() => {
        fetch('/api/dicethrone/heros?filtreBoxes=')
        .then(response => response.json())
        .then(data => {
          setListeHeros(data);
        })
        .catch(error => console.error('Erreur fetch dice throne héros :', error));
    }, [])

    useEffect(() => {
      const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 992);
      checkScreenSize();

      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        currentEtapeDraft == 8 && setIndiceJoueurViewedPourBan(1)
        currentEtapeDraft == 9 && setIndiceJoueurViewedPourBan(0)
        currentEtapeDraft == 10 && setIndiceJoueurViewedPourBan(1)
    }, [currentEtapeDraft]);

    const handleClickOnBox = (codeBoite, numWave) => {
        setListeBoite(prevListeBoites => 
            prevListeBoites?.map(prevBoite =>
                prevBoite.CodeBox === codeBoite
                ? {...prevBoite, 
                    Selected: !prevBoite?.Selected}
                : prevBoite,
            ));
        console.log(numWave);
        setListeSets(prevListeSets => 
            prevListeSets?.map(prevSet =>
                prevSet.Numero === numWave
                ? {...prevSet,
                    Selected: false}
                : prevSet
            ))
    };

    const handleClickOnSet = (numWave, selectedOrNot) => {
        console.log(numWave);
        setListeBoite(prevListeBoites => 
            prevListeBoites?.map(prevBoite =>
                prevBoite.Vague === numWave
                ? {...prevBoite, 
                    Selected: selectedOrNot,
                }
                : prevBoite
            ))

        setListeSets(prevListeSets => 
            prevListeSets?.map(prevSet =>
                prevSet.Numero === numWave
                ? {...prevSet,
                    Selected: !prevSet.Selected}
                : prevSet
            ))
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

    const handleBuildFiltreHeros = (boxes) => {
        const selectedBoxes = boxes?.filter(b => b?.Selected);
        const filtreHeros = selectedBoxes.map(b => b.CodeBox).join("$");

        if (selectedBoxes.length > 0) {
            setFiltreOnAllBoxes(false);
        }

        getHerosFromBoxesSelected(filtreHeros);
    };

    const getHerosFromBoxesSelected = (filtre) => {
        fetch('/api/dicethrone/heros?filtreBoxes=' + filtre)
        .then(response => response.json())
        .then(data => {
          setListeHeros(data);
        })
        .catch(error => console.error('Erreur fetch dice throne héros :', error));
    };

    const handleClickOnHeros = (codeHeros, libelleHeros, LienImg, selectedOrNot, indiceIfBan) => {
        if (selectedOrNot) {
            return;
        }
        setListeHeros(prevListeHeros => 
            prevListeHeros?.map(prevHeros =>
                prevHeros.CodeHeros === codeHeros
                ? {...prevHeros, 
                    Selected: true,
                    TypeSelected: phasePickOrBan}
                : prevHeros
            ));
        setLastHerosSaisieForRollback(prev => 
            ({...prev,
                codeHeros: codeHeros,
                libelleHeros: libelleHeros
            })
        );
        
        
        switch (currentEtapeDraft) {
            case 1:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit SELECTIONNER un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        HerosPickA: LienImg,
                        LibelleHerosPickA: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 2:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit SELECTIONNER un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        HerosPickA: LienImg,
                        LibelleHerosPickA: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 3:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit SELECTIONNER un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        HerosPickB: LienImg,
                        LibelleHerosPickB: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 4:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit SELECTIONNER un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        HerosPickB: LienImg,
                        LibelleHerosPickB: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 5:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit SELECTIONNER un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        HerosPickC: LienImg,
                        LibelleHerosPickC: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 6:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                setTxtCurrentInstructionColor("txtClignoteRed");
                setTxtCurrentInstruction("doit BANNIR un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        HerosPickC: LienImg,
                        LibelleHerosPickC: libelleHeros}
                    : draftFromCurrentPlayer
                ));
                break;
            case 7:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                setTxtCurrentInstructionColor("txtClignoteRed");
                setTxtCurrentInstruction("doit BANNIR un héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        IndiceHerosBan: indiceIfBan}
                    : draftFromCurrentPlayer
                ));
                break;
            case 8:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
                setTxtCurrentPlayerColor("txtColorPlayerRed");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit valider son héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        IndiceHerosBan: indiceIfBan}
                    : draftFromCurrentPlayer
                ));
                break;
            case 9:
                setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerB"]?.value || "Joueur B");
                setTxtCurrentPlayerColor("txtColorPlayerBlue");
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit valider son héros");
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 1
                    ? {...draftFromCurrentPlayer, 
                        IndiceHerosSelectedFinal: indiceIfBan}
                    : draftFromCurrentPlayer
                ));
                break;
            case 10:
                setHerosPickBanByPlayer(prevHerosPickBanByPlayer => 
                    prevHerosPickBanByPlayer?.map(draftFromCurrentPlayer =>
                    draftFromCurrentPlayer.ID === 2
                    ? {...draftFromCurrentPlayer, 
                        IndiceHerosSelectedFinal: indiceIfBan}
                    : draftFromCurrentPlayer
                ));
                setDraftTermine(true);
                break;
            }

        setCurrentEtapeDraft(prev => prev + 1);
    };

    const handleLoadtxtDebutPhaseDraft = () => {
        setTxtCurrentPlayer(inputsRef?.current["pseudoPlayerA"]?.value || "Joueur A");
        setTxtCurrentPlayerColor("txtColorPlayerRed");
        setTxtCurrentInstructionColor("txtClignoteGreen");
        setTxtCurrentInstruction("doit SELECTIONNER un héros");
    };

    useEffect(() => {
        let nbHeros = 0;
        listeBoites?.map((currentBoite) => {
            currentBoite.Selected && (nbHeros += parseInt(currentBoite.nbheros));
        });

        if(nbHeros == 0) {
            listeBoites?.map((currentBoite) => {
                nbHeros += parseInt(currentBoite.nbheros);
            });
        } 

        setCompteurNbHerosSelonBoitesSelected(isNaN(nbHeros) ? 0 : nbHeros);
    }, [listeBoites])

    console.log('boites', listeBoites);
    console.log('heros', listeHeros);
    console.log('etape', currentEtapeDraft);

    return (
        <>
            <div className="container-xl mt-3">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mt-4 text-center txtColorWhite">Dice Throne : Module de draft</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center ">
                        <img src="\images\dicethrone\DiceThrone.png" className="img-fluid rounded-2" alt="..."></img>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-5">   
                        <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Un module de draft pour Dice Throne ?" textMain={`Ce module permet de réaliser un draft de type <b>"Snake Draft avec bans/picks"</b> pour le jeu <b>Dice Throne</b>.<br /><br />
                            Voici le déroulement :<br />
                            1. Commencez par sélectionner les boîtes de jeu que vous souhaitez utiliser.<br />
                            2. Une liste de héros issus de ces boîtes vous sera alors proposée.<br />
                            3. Les joueurs entament ensuite la phase de sélection (pick) pour choisir 3 héros chacun.<br />
                            4. Chaque joueur peut alors bannir un héros parmi ceux de son adversaire.<br />
                            5. Enfin, chacun valide le héros avec lequel il disputera la partie.<br />
                            6. Il ne reste plus qu’à jouer</b> !`}/>       
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
                {currentEtapeDraft === 0 &&
                <>
                    <div className="row">             
                        <div className="col-12 mt-3 d-flex justify-content-center">
                                <h6 className="mt-4 text-center txtColorWhite">Sélectionnez une saison ...</h6>
                        </div>
                    </div> 
                    <div className="row">             
                        <div className="col-12 d-flex justify-content-center">
                            <div className="p-3">
                                <div className={`list-group ${styles.shadow}`}>
                                    {listeSets?.map((current, index) => (
                                        <button type="button" key={index} className={`list-group-item list-group-item-action ${!current.Selected ? styles.bandeauTag : styles.bandeauTagFocus}`} onClick={() => handleClickOnSet(current.Numero, true)}>Vague {current.Numero}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">             
                        <div className="col-12 mt-2 d-flex justify-content-center">
                                <h6 className="text-center txtColorWhite">ou sélectionnez les boites à utiliser pour le draft</h6>
                        </div>
                    </div> 
                </>
                }

                {currentEtapeDraft >= 1 &&
                <>
                    <div className="row">             
                        <div className="col-12 mt-3 d-flex justify-content-center">
                            <h6 className="mt-4 text-center txtColorWhite">Le draft porte sur les sets suivants :</h6>
                        </div>
                    </div>
                    <div className="row">             
                        <div className="col-12 mb-2 col-lg-6 offset-lg-3 mt-2 d-flex justify-content-center">
                            <ul className="list-group">
                                {listeBoites?.map((currentBoite, index) => (
                                    currentBoite.Selected == true &&
                                    <li key={"boxResume-" + index} className="list-group-item static">{currentBoite.Libelle}</li>
                                ))}
                                {filtreOnAllBoxes && <li className="list-group-item static">Collection complète</li>}
                            </ul>
                        </div>
                    </div>
                </>
                }
                {!draftTermine && 
                <div className="row">
                    <div className="col-12 mt-2 d-flex justify-content-center">
                        <i className={`bx bx-check ${modeSelectByDoubleClic ? "bxInactiveToActive" : "bxActive"}`} onClick={() => modeSelectByDoubleClic && setModeSelectByDoubleClic(false)}></i>
                        <i className={`bx bx-check-double ${modeSelectByDoubleClic ? "bxActive" : "bxInactiveToActive"} ms-3`} onClick={() => !modeSelectByDoubleClic && setModeSelectByDoubleClic(true)}></i>
                    </div>
                </div>
                }
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                            {!draftTermine &&
                                <h6 className="text-center txtColorDarkBisLight">{modeSelectByDoubleClic ? "(sélection par double clic)" : <>&nbsp;</>}</h6>
                            }
                    </div>
                </div>
                {(currentEtapeDraft >= 0 && currentEtapeDraft < 1) &&
                    <div className="row">             
                        <div className="col-12 mt-1 justify-content-center">
                            <h5 className={`mt-2 mb-4 text-center ${compteurNbHerosSelonBoitesSelected >= 6 ? "txtColorSuccessLight" : "txtColorDangerLight"}`}>{compteurNbHerosSelonBoitesSelected} héros sélectionnés (sur 6 minimum)</h5>
                        </div>
                    </div>
                }

                {currentEtapeDraft === 0 &&
                <>
                    <div className="row">             
                        <div className="col-12 mt-3 d-flex flex-wrap justify-content-center">
                            {listeBoites?.map((currentBoite, index) => (
                                <div key={index} className={`${styles.conteneurImgX6} me-3 mb-3 noFocus`}>
                                    <img src={currentBoite.LienImg} className={`rounded float-start noFocus ${styles.responsiveImgListeX5} ${currentBoite?.Selected && styles.conteneurImgSelected}`} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnBox(currentBoite?.CodeBox, currentBoite?.Vague)} onClick={() => !modeSelectByDoubleClic && handleClickOnBox(currentBoite?.CodeBox, currentBoite?.Vague)} alt="..."></img>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
                }
                {currentEtapeDraft === 0 &&
                <div className="row">             
                    <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                        <button type="button" disabled={compteurNbHerosSelonBoitesSelected < 6} className={`btn btn-primary ${compteurNbHerosSelonBoitesSelected >= 6 ? "btn-ColorA" : "btn-ColorInactif"}`} onClick={() => {handleBuildFiltreHeros(listeBoites); setCurrentEtapeDraft(prev => prev +1); handleLoadNamePlayers(); handleLoadtxtDebutPhaseDraft()}}>Valider la sélection de boites</button>
                    </div>
                </div>
                }
                {(currentEtapeDraft >= 1 && currentEtapeDraft < 10) &&
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            {showOverlayHeros ? 
                                <i className={`bx bx-image-alt bxNormalOrange`} onClick={() => setShowOverlayHeros(false)}></i> :
                                <i className={`bx bx-detail bxNormalOrange`} onClick={() => setShowOverlayHeros(true)}></i>
                            }
                        </div>
                    </div>
                }
                {(currentEtapeDraft >= 1 && currentEtapeDraft < 7) &&
                        <div className="row">        
                            <div className="col-12 mt-4 d-flex flex-wrap justify-content-center">
                                {listeHeros?.map((currentHeros, index) => (
                                    <div key={"heros-" + index} className={`noFocus ${styles.conteneurImgX6} ${phasePickOrBan == "Pick" && styles.toPick} ${phasePickOrBan == "Ban" && styles.toBan} ${currentHeros.TypeSelected == "Pick" ? styles.factionPicked : (currentHeros.TypeSelected == "Ban" ? styles.factionBanned : "")} me-3 mb-3`}>
                                        <div className={` noFocus${styles.blocFaction} ${currentHeros?.Selected && styles.grayscale}`}>
                                            <img src={currentHeros.LienImg} className={`noFocus rounded float-start ${styles.responsiveImgFaction}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.LienImg, currentHeros?.Selected)} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnHeros(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.LienImg, currentHeros?.Selected)} alt="..."></img>
                                        </div>
                                        <div className={`${styles.overlayText} ${showOverlayHeros && styles.show}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.LienImg, currentHeros?.Selected)} onDoubleClick={() => handleClickOnHeros(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.LienImg, currentHeros?.Selected)}>
                                            {currentHeros.Libelle}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                }

                {(currentEtapeDraft > 6 && currentEtapeDraft <= 10) &&
                    <div className="row">        
                        <div className="col-12 mt-4 d-flex flex-wrap justify-content-center">
                            {herosPickBanByPlayer[indiceJoueurViewedPourBan].IndiceHerosBan !== 1 &&
                                <div className={`noFocus ${styles.conteneurImgX6} ${styles.toBan} me-3 mb-3`}>
                                    <div className={`noFocus ${styles.blocFaction}`}>
                                        <img src={herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickA} className={`noFocus rounded float-start ${styles.responsiveImgFaction}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickA, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickA, "", 1)} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickA, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickA, "", 1)} alt="..."></img>
                                    </div>
                                    <div className={`${styles.overlayText} ${showOverlayHeros && styles.show}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickA, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickA, "", 1)} onDoubleClick={() => handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickA, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickA, "", 1)}>
                                            {herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickA}
                                    </div>
                                </div>
                            }
                            {herosPickBanByPlayer[indiceJoueurViewedPourBan].IndiceHerosBan !== 2 &&
                            <div className={`noFocus ${styles.conteneurImgX6} ${styles.toBan} me-3 mb-3`}>
                                <div className={`noFocus ${styles.blocFaction}`}>
                                    <img src={herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickB} className={`noFocus rounded float-start ${styles.responsiveImgFaction}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickB, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickB, "", 2)} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickB, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickB, "", 2)} alt="..."></img>
                                </div>
                                <div className={`${styles.overlayText} ${showOverlayHeros && styles.show}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickB, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickB, "", 2)} onDoubleClick={() => handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickB, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickB, "", 2)}>
                                    {herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickB}
                                </div>
                            </div>
                            }
                            {herosPickBanByPlayer[indiceJoueurViewedPourBan].IndiceHerosBan !== 3 &&
                            <div className={`noFocus ${styles.conteneurImgX6} ${styles.toBan} me-3 mb-3`}>
                                <div className={`noFocus ${styles.blocFaction}`}>
                                    <img src={herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickC} className={`noFocus rounded float-start ${styles.responsiveImgFaction}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickC, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickC, "", 3)} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickC, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickC, "", 3)} alt="..."></img>
                                </div>
                                <div className={`${styles.overlayText} ${showOverlayHeros && styles.show}`} onClick={() => !modeSelectByDoubleClic && handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickC, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickC, "", 3)} onDoubleClick={() => handleClickOnHeros("", herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickC, herosPickBanByPlayer[indiceJoueurViewedPourBan].HerosPickC, "", 3)}>
                                    {herosPickBanByPlayer[indiceJoueurViewedPourBan].LibelleHerosPickC}
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                }

                {currentEtapeDraft >= 1 &&
                    <>
                        {draftTermine &&
                        <div className="row">             
                            <div className={`col-12 mt-5 mb-2 d-flex justify-content-center`}>
                                    <h5 className="text-center txtColorWhite">Le draft est à présent terminé !</h5>
                            </div>
                        </div>
                        }
                        <div className="row">             
                            <div className={`col-12 ${draftTermine ? "mt-1" : "mt-4"} mb-2 d-flex justify-content-center`}>
                                    <h4 className="text-center txtColorWhite">Résultat du draft</h4>
                            </div>
                        </div>
                        <div className="row">        
                            <div className="col-12 mt-2 mb-5 d-flex flex-wrap justify-content-center">
                                <div className={`col-12 col-lg-6 mb-2 ${isLargeScreen ? "ps-3" : "pe-3"} d-flex flex-wrap justify-content-center txtColorRed`}><b>{namePlayers.J1}</b></div>
                                    {isLargeScreen && <div className="col-6 mb-2 pe-3 d-flex flex-wrap justify-content-center txtColorBlue"><b>{namePlayers.J2}</b></div>}
                                    <div className={`${styles.conteneurImgResultatDraft} me-3 mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[0].IndiceHerosBan == 1 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[0].HerosPickA ? herosPickBanByPlayer[0].HerosPickA : "/images/dicethrone/NCRed.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[0].IndiceHerosSelectedFinal == 1 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedRed}`} alt="..."></img>
                                    </div>
                                    <div className={`${styles.conteneurImgResultatDraft} me-3 mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[0].IndiceHerosBan == 2 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[0].HerosPickB ? herosPickBanByPlayer[0].HerosPickB : "/images/dicethrone/NCRed.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[0].IndiceHerosSelectedFinal == 2 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedRed}`} alt="..."></img>
                                    </div>
                                    <div className={`${styles.conteneurImgResultatDraft} me-3 mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[0].IndiceHerosBan == 3 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[0].HerosPickC ? herosPickBanByPlayer[0].HerosPickC : "/images/dicethrone/NCRed.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[0].IndiceHerosSelectedFinal == 3 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedRed}`} alt="..."></img>
                                    </div>
                                    {!isLargeScreen && <div className="col-12 col-lg-6 mb-2 pe-3 d-flex flex-wrap justify-content-center txtColorBlue"><b>{namePlayers.J2}</b></div>}
                                    <div className={`${styles.conteneurImgResultatDraft} me-3 mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[1].IndiceHerosBan == 1 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[1].HerosPickA ? herosPickBanByPlayer[1].HerosPickA : "/images/dicethrone/NCBlue.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[1].IndiceHerosSelectedFinal == 1 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedBlue}`} alt="..."></img>
                                    </div>
                                    <div className={`${styles.conteneurImgResultatDraft} me-3 mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[1].IndiceHerosBan == 2 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[1].HerosPickB ? herosPickBanByPlayer[1].HerosPickB : "/images/dicethrone/NCBlue.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[1].IndiceHerosSelectedFinal == 2 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedBlue}`} alt="..."></img>
                                    </div>
                                    <div className={`${styles.conteneurImgResultatDraft} ${!isLargeScreen && "me-3"} mb-3 ${styles.blocFaction} ${herosPickBanByPlayer[1].IndiceHerosBan == 3 && currentEtapeDraft > 8 ? styles.grayscale : ""}`}>
                                            <img src={herosPickBanByPlayer[1].HerosPickC ? herosPickBanByPlayer[1].HerosPickC : "/images/dicethrone/NCBlue.png"} className={`rounded float-start ${styles.responsiveImgFaction} ${herosPickBanByPlayer[1].IndiceHerosSelectedFinal == 3 && currentEtapeDraft > 10 ? styles.factionSelectedFinal : styles.factionPickedBlue}`} alt="..."></img>
                                    </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            {!draftTermine && currentEtapeDraft >= 1 &&
                <div className={styles.bandeauInstructionDraft}>
                    <div className="col-12 d-flex justify-content-center">
                        {!draftTermine &&
                            <h5 className={`text-center ${txtCurrentPlayerColor}`}><b>{txtCurrentPlayer}</b></h5>
                            }&nbsp;
                            {!draftTermine &&
                                <h5 className={`text-center ${txtCurrentInstructionColor}`}>{txtCurrentInstruction}</h5>
                            }
                    </div>
                </div>
            }
        </>
    );
}

export default DiceThroneDrafter;