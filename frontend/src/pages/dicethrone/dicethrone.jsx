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
    const [phasePickOrBan, setPhasePickOrBan] = useState("");
    const [showOverlayFactions, setShowOverlayFactions] = useState(false);
    const [draftTermine, setDraftTermine] = useState(false);
    const [filtreOnAllBoxes, setFiltreOnAllBoxes] = useState(true);
    const [namePlayers, setNamePlayers] = useState([
        { J1: "Joueur A", J2: "Joueur B"}
    ]);

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
                    Selected: selectedOrNot}
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

    const handleClickOnFaction = (codeFaction, libelleFaction, selectedOrNot) => {
    };

    console.log('boites', listeBoites);
    console.log('heros', listeHeros);

    return (
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

            <div className="row">
                <div className="col-12 mt-2 d-flex justify-content-center">
                    <i className={`bx bx-check ${modeSelectByDoubleClic ? "bxInactiveToActive" : "bxActive"}`} onClick={() => modeSelectByDoubleClic && setModeSelectByDoubleClic(false)}></i>
                    <i className={`bx bx-check-double ${modeSelectByDoubleClic ? "bxActive" : "bxInactiveToActive"} ms-3`} onClick={() => !modeSelectByDoubleClic && setModeSelectByDoubleClic(true)}></i>
                </div>
            </div>
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                        {!draftTermine &&
                            <h6 className="text-center txtColorDarkBisLight">{modeSelectByDoubleClic ? "(sélection par double clic)" : <>&nbsp;</>}</h6>
                        }
                </div>
            </div>

            {currentEtapeDraft === 0 &&
            <>
                <div className="row">             
                    <div className="col-12 mt-3 d-flex flex-wrap justify-content-center">
                        {listeBoites?.map((currentBoite, index) => (
                            <div key={index} className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <img src={currentBoite.LienImg} className={`rounded float-start ${styles.responsiveImgListeX5} ${currentBoite?.Selected && styles.conteneurImgSelected}`} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnBox(currentBoite?.CodeBox, currentBoite?.Vague)} onClick={() => !modeSelectByDoubleClic && handleClickOnBox(currentBoite?.CodeBox, currentBoite?.Vague)} alt="..."></img>
                            </div>
                        ))}
                    </div>
                </div>
            </>
            }
            {currentEtapeDraft === 0 &&
            <div className="row">             
                <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                    <button type="button" className={`btn btn-primary btn-ColorA`} onClick={() => {handleBuildFiltreHeros(listeBoites); setCurrentEtapeDraft(prev => prev +1); handleLoadNamePlayers()}}>Valider la sélection de boites</button>
                </div>
            </div>
            }
            {currentEtapeDraft >= 1 &&
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
                        {listeHeros?.map((currentHeros, index) => (
                            <div key={"heros-" + index} className={`${styles.conteneurImgX5} ${phasePickOrBan == "Pick" && styles.toPick} ${phasePickOrBan == "Ban" && styles.toBan} ${currentHeros.TypeSelected == "Pick" ? styles.factionPicked : (currentHeros.TypeSelected == "Ban" ? styles.factionBanned : "")} me-3 mb-3`}>
                                <div className={`${styles.blocFaction} ${currentHeros?.Selected && styles.grayscale}`}>
                                    <img src={currentHeros.LienImg} className={`rounded float-start ${styles.responsiveImgFaction}`} onClick={() => !modeSelectByDoubleClic && handleClickOnFaction(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.Selected)} onDoubleClick={() => modeSelectByDoubleClic && handleClickOnFaction(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.Selected)} alt="..."></img>
                                </div>
                                <div className={`${styles.overlayText} ${showOverlayFactions && styles.show}`} onClick={() => !modeSelectByDoubleClic && handleClickOnFaction(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.Selected)} onDoubleClick={() => handleClickOnFaction(currentHeros?.CodeHeros, currentHeros?.Libelle, currentHeros?.Selected)}>
                                    {currentHeros.Libelle}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row">             
                    <div className="col-12 mt-5 mb-2 d-flex justify-content-center">
                            <h4 className="text-center txtColorWhite">Résultat du draft</h4>
                    </div>
                </div>
                <div className="row">        
                    <div className="col-12 mt-4 d-flex flex-wrap justify-content-center">
                        <div className="col-6 d-flex flex-wrap justify-content-center">{namePlayers.J1}</div>
                        <div className="col-6 d-flex flex-wrap justify-content-center">{namePlayers.J2}</div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCRed.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCRed.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCRed.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCBlue.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCBlue.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                            <div className={`${styles.conteneurImgX5} me-3 mb-3`}>
                                <div className={`${styles.blocFaction}`}>
                                    <img src="\images\dicethrone\NCBlue.png" className={`rounded float-start ${styles.responsiveImgFaction}`} alt="..."></img>
                                </div>
                            </div>
                    </div>
                </div>
            </>
            }
        </div>
    );
}

export default DiceThroneDrafter;