import {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from './keyforge.module.css';
import ModalCreateNewDraftKeyforge from '../../components/modals/CreateNewDraftKeyforge';
import Accordeon from '../../components/others/Accordeon';
import Pagination from '../../components/others/Pagination';
import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
import Loader from '../../components/others/Loader';

const Keyforge = () => {
    const { showOngletAlerte } = useOngletAlerteContext();
    const [isLoading, setIsLoading] = useState(true);
    const [listeMyDrafts, setListeMyDrafts] = useState();
    const [showFormCreateNewDraft, setShowFormCreateNewDraft] = useState(false);
    const inputsRef = useRef({});
    const {sessionUser, setSessionUser} = useSessionUserContext();
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
          setIsLoading(false);
        }).catch(error => console.error('Erreur fetch keyforge drafts:', error));
    }, [sessionUser?.id]);

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
        setListeMyDrafts(prev => prev.filter(current => current.ID !== codeDraft));
    } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
    }
    };
    console.log(listeMyDrafts);
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
                            <Accordeon blocSoloOrTopOrMidOrBot="Solo" textTitre="Un module de deckbuilding pour Keyforge ?" textMain={`Ce module permet de réaliser un draft de type <b>"Trinômes"</b> (façon Arène de Hearthstone) pour le jeu <b>Keyforge</b>.<br /><br />
                                Voici le déroulement :<br />
                                1. Créez un nouveau draft en choisissant le <b>Set de jeu</b>.<br />
                                2. Réalisez la <b>phase de Pick/Ban des maisons</b> pour les deux joueurs.<br />
                                3. Une fois les maisons validées, passez au <b>Draft des cartes</b> : pour chaque maison, vous devrez choisir 12 cartes parmis des propositions de trinômes.<br />
                                4. Exportez votre liste et jouez !`}/>
                        </div>
                    </div>
                {(sessionUser ?
                <><ModalCreateNewDraftKeyforge show={showFormCreateNewDraft} handleClose={setShowFormCreateNewDraft} handleRefresh={setListeMyDrafts}/>
                    <div className="row">
                        <div className="col-12 mt-4">
                            <h2 className="text-center txtColorWhite mb-4">Mes drafts</h2>
                            <i className={`bx bx-list-plus bxNormalOrange`} onClick={() => {setShowFormCreateNewDraft(true)}}></i>
                            <div className="row">
                                <div className="col-4 col-lg-4">
                                    <b>Draft</b>
                                </div>
                                <div className="col-4 col-lg-2">
                                    <b>Maisons J1</b>
                                </div>
                                <div className="col-4 col-lg-2">
                                    <b>Maisons J2</b>
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
                                    <img 
                                        src={currentDraft.LienImgFactionPickAJ1 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={currentDraft.LienImgFactionPickBJ1 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={currentDraft.LienImgFactionPickCJ1 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                </div>
                                <div className="col-1 col-lg-2">
                                    <img 
                                        src={currentDraft.LienImgFactionPickAJ2 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={currentDraft.LienImgFactionPickBJ2 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={currentDraft.LienImgFactionPickCJ2 || "/images/keyforge/NC.png"} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                <span>{new Date(currentDraft?.DateCreation).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="d-none d-lg-block col-lg-1">
                                <span>{new Date(currentDraft?.DateDerModif).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="col-3 col-lg-2">
                                    <div className="d-inline"><i className="bx bx-circle-quarter bxNormalOrangeWithoutHover topMinus3"></i></div>
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