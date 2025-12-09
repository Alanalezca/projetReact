import {useState, useRef, useEffect} from 'react';
import styles from './keyforge.module.css';
import InputStandard from '../../components/inputs/InputStandard';
import Accordeon from '../../components/others/Accordeon';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';

const Keyforge = () => {
    const [currentEtapeDraft, setCurrentEtapeDraft] = useState(0);
    const inputsRef = useRef({});
    const {sessionUser, setSessionUser} = useSessionUserContext();
    return (
            <div className="container-xl mt-3">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h2 className="mt-4 text-center txtColorWhite">Keyforge : Deckbuilder par trinomes</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center ">
                            <img src="\images\keyforge\banniere.png" className="img-fluid rounded-2" alt="..."></img>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-5">   
                            <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Un module de deckbuilding pour Keyforge ?" textMain={`Ce module permet de réaliser un draft de type <b>"Snake Draft avec bans/picks"</b> pour le jeu <b>Smash Up</b>.<br /><br />
                                Voici le déroulement :<br />
                                1. Choisissez <b>le nombre de joueurs</b> participant à la partie.<br />
                                2. Sélectionnez <b>les boîtes de jeu</b> qui seront utilisées.<br />
                                - "<b>Valider la sélection</b>" -> Fait ressortir la totalité des factions contenues dans les boites sélectionnées.<br />
                                - "<b>Valider et randomiser</b>" -> Ne fait ressortir que (nombre de joueurs x4) +4 factions choisies au hasard parmis les factions contenues dans les boites sélectionnées.
                                3. La liste des <b>factions</b> correspondant aux boîtes choisies sera alors proposée.<br />
                                4. Chaque joueur procédera ensuite à la <b>phase de pick/ban</b> dans l’ordre indiqué.<br />
                                5. Prêt à <b>jouer</b> !`}/>
                        </div>
                    </div>
                {(sessionUser?.grade == "Administrateur" ?
                <>
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
                    <div className="row">             
                        <div className="col-12 mt-3 d-flex justify-content-center">
                                <h6 className="mt-4 text-center txtColorWhite">Sélectionnez un set...</h6>
                        </div>
                    </div>
                    <div className="row">             
                        <div className="col-12 d-flex justify-content-center">
                            <div className="p-3">
                                <div className={`list-group ${styles.shadow}`}>
                                    {["Set 1", "Set 2"]?.map((current, index) => (
                                    <button type="button" key={index} className={`list-group-item list-group-item-action text-center ${!current.Selected ? styles.bandeauTag : styles.bandeauTagFocus}`}>{current}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">             
                        <div className="col-12 mt-3 d-flex justify-content-center">
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                                <label class="form-check-label txtColorWhite" for="exampleCheck1">Inclure la possibilité d'anomalies</label>
                            </div>
                        </div>
                    </div>
                </>
                     : 
                    <div className="row">
                        <div className="col-12 col-lg-12 mt-1 mb-5">
                            <h2 className="mt-5 text-center txtColorWhite">Le module de deckbuilding Keyforge requiert d'être connecté.</h2> 
                        </div>
                    </div>
                )}
            </div>
    )
};

export default Keyforge;