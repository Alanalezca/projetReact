import { useState, useRef, useEffect } from 'react';
import styles from './dicethrone.module.css';
import Loader from '../../components/others/Loader';
import Accordeon from '../../components/others/Accordeon';
import InputStandard from '../../components/inputs/InputStandard';

const DiceThroneDrafter = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentEtapeDraft, setCurrentEtapeDraft] = useState(0);
    const inputsRef = useRef({});
















    return (
        <div className="container-xl mt-3">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="mt-4 text-center txtColorWhite">Dice Throne : Module de draft</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-8 offset-2 d-flex justify-content-center">
                    <img src="\images\dicethrone\DiceThrone.png" class="img-fluid" alt="..."></img>
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
        </div>
    );
}

export default DiceThroneDrafter;