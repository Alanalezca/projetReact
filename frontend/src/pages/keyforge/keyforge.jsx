import {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './keyforge.module.css';
import InputStandard from '../../components/inputs/InputStandard';
import ModalCreateNewDraftKeyforge from '../../components/modals/CreateNewDraftKeyforge';
import Accordeon from '../../components/others/Accordeon';
import Pagination from '../../components/others/Pagination';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
import convertDateToDateLong from '../../functions/getDateLong';
import Loader from '../../components/others/Loader';

const Keyforge = () => {
    const { showOngletAlerte } = useOngletAlerteContext();
    const [isLoading, setIsLoading] = useState(true);
    const [currentEtapeDraft, setCurrentEtapeDraft] = useState(0);
    const [listeSets, setListeSets] = useState();
    const [idSetSelected, setIDSetSelected] = useState();
    const [listeMyDrafts, setListeMyDrafts] = useState();
    const [reloadMyDraft, setReloadMyDraft] = useState(1);
    const [showFormCreateNewDraft, setShowFormCreateNewDraft] = useState(false);
    const inputsRef = useRef({});
    const {sessionUser, setSessionUser} = useSessionUserContext();
    const [unlockBtnValiderCreateNewDraft, setUnlockBtnValiderCreateNewDraft] = useState(false);
    // Pagination : Début //
    const nbElementsParPage = 10;
    const [numCurrentPagePaginationActive, setNumCurrentPagePaginationActive] = useState(1);
    // Pagination : Fin //

    const indiceFirstElement = (nbElementsParPage * numCurrentPagePaginationActive) - nbElementsParPage;
    const indiceLastElement = ((nbElementsParPage * numCurrentPagePaginationActive));

    useEffect(() => {
        if (!sessionUser?.id) return;
        setIsLoading(true);
        fetch(`/api/keyforge/myDrafts?userId=${sessionUser?.id}`)
        .then(response => response.json())
        .then(data => {
          setListeMyDrafts(data);
          //console.log(data);
          setIsLoading(false);
        }).catch(error => console.error('Erreur fetch keyforge drafts:', error));
    }, [reloadMyDraft, sessionUser?.id]);

    useEffect(() => {
        if (!sessionUser?.id) return;
        setIsLoading(true);
        fetch('/api/keyforge/sets')
        .then(response => response.json())
        .then(data => {
          setListeSets(data);
          setIsLoading(false);
        }).catch(error => console.error('Erreur fetch keyforge sets:', error));
    }, []);

    const handleDeleteDraft = async (codeDraft, titreDraft) => {
    try {
        const response = await fetch("/api/keyforge/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ parCodeDraft: codeDraft})
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
        }

        const result = await response.json();
        showOngletAlerte('success', '(Suppression draft)', '', `Le draft KeyForge "` + titreDraft + `" a bien été supprimé.`);
        setReloadMyDraft(prev => prev + 1);
    } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
    }
    };

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
                <><ModalCreateNewDraftKeyforge show={showFormCreateNewDraft} handleClose={setShowFormCreateNewDraft} handleRefresh={setReloadMyDraft}/>
                    <div className="row">
                        <div className="col-12 mt-4">
                            <h2 className="text-center txtColorWhite mb-4">Mes drafts</h2>
                            <i className={`bx bx-list-plus bxNormalOrange`} onClick={() => {setShowFormCreateNewDraft(true)}}></i>
                            <div className="row">
                                <div className="col-4 col-lg-4">
                                    <b>Draft</b>
                                </div>
                                <div className="col-4 col-lg-2">
                                    <b>Factions J1</b>
                                </div>
                                <div className="col-4 col-lg-2">
                                    <b>Factions J2</b>
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                    <b>Création</b>
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                    <b>Der. màj</b>
                                </div>
                                <div className="col-4 col-lg-2">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.breakerTitre} mt-3`}></div>
                    <div className="row d-flex align-items-center mb-4">
                        <div className="col-12 mt-3">
                        {isLoading ?
                        <Loader/> : <>
                        {listeMyDrafts?.length > 0 ? (
                            listeMyDrafts.slice(indiceFirstElement, indiceLastElement).map((currentDraft) => (
                            <div key={currentDraft.ID} className="row mt-1">
                                <div className="col-4 col-lg-4">
                                    <Link to={`/draftKeyforge/${currentDraft.ID}`}>
                                        <span className="cPointer txtColorWhiteToTxtColorB">{currentDraft?.Titre}</span>
                                    </Link>
                                </div>
                                <div className="col-1 col-lg-2">
                                    <div className="d-inline"><i className="bx bx-cloud bxEnabledToDisabled topMinus3 cPointer"></i></div>
                                    <div className="d-inline"><i className="bx bx-cloud-upload bxDisabledToEnabled topMinus3 cPointer"></i></div>
                                    <div className="d-inline"><i className="bx bx-cloud bxEnabledToDisabled topMinus3 cPointer"></i></div>
                                </div>
                                <div className="col-1 col-lg-2">
                                    <div className="d-inline"><i className="bx bx-cloud bxEnabledToDisabled topMinus3 cPointer"></i></div>
                                    <div className="d-inline"><i className="bx bx-cloud-upload bxDisabledToEnabled topMinus3 cPointer"></i></div>
                                    <div className="d-inline"><i className="bx bx-cloud bxEnabledToDisabled topMinus3 cPointer"></i></div>
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                <span>{new Date(currentDraft?.DateCreation).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                <span>{new Date(currentDraft?.DateDerModif).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="col-3 col-lg-2">
                                    <div className="d-inline"><i className="bx bx-circle-quarter bxNormalOrangeWithoutHover topMinus3"></i></div>
                                    <div className="d-inline"><i className="bx bx-edit bxNormalOrange topMinus3 cPointer"></i></div>
                                    <div className="d-inline"><i className="bx bx-message-square-x bxNormalOrange topMinus3 cPointer" onClick={(e) => handleDeleteDraft(currentDraft?.ID, currentDraft?.Titre)}></i></div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p>Aucun draft créé</p>
                        )}</>}
                        </div>
                    </div>
                    <div className="mt-5 mb-5">
                        <Pagination centrer="true" totalNbElement={listeMyDrafts?.length} nbElementParPage={nbElementsParPage} numCurrentPageActive={numCurrentPagePaginationActive} setterCurrentNumPageActive={setNumCurrentPagePaginationActive}/>
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