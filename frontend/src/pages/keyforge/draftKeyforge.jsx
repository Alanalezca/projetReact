    import {useState, useMemo, useEffect} from 'react';
    import styles from './draftKeyforge.module.css';
    import { useParams } from 'react-router-dom';
    import Loader from '../../components/others/Loader';
    import { Button } from 'react-bootstrap';
    import creationPoolCartes from '../../functions/keyforge/creationPoolCartes';
    import recupKeyforgeTxtCurrentInstruction from '../../functions/keyforge/recupKeyforgeTxtCurrentInstruction';
    import pullDraftKeyforge from '../../functions/callAPIx/keyforgePullDraftKeyforge';
    import pullCurrentFactionsFromSet from '../../functions/callAPIx/keyforgePullFactionsFromSet';
    import updateFactionsCurrentDraft from '../../functions/callAPIx/keyforgeUpdateFactionsSpecificDraft';
    import DraftKeyforgePartCardsSelection from '../../pages/keyforge/draftKeyforgePartCardsSelection';
    import pullCurrentDraftPoolCards from '../../functions/callAPIx/keyforgePullCurrentDraftPoolCards';
    import pullCurrentDraftCardsSelected from '../../functions/callAPIx/keyforgePullCurrentDraftCardsSelected';
    import DraftKeyforgeResume from '../../pages/keyforge/draftKeyforgeResume';
    import { useKeyforgeContext } from '../../../src/components/contexts/keyforgeContext';
    import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
    import Tooltip from '../../components/others/Tooltip';
    import DraftKeyforgePartBoutonsJ1J2 from '../../pages/keyforge/draftKeyforgePartBoutonsJ1J2';
    import { useDraftFactions } from '../../functions/hooks/useDraftFactions';

    {/* Composant parent du module de draft Keyforge */}
    const DraftKeyforge = () => {
        const { slug } = useParams();
        const {sessionUser, setSessionUser} = useSessionUserContext();
        const {
            setDraftEnCoursParJoueurAouB, 
            setDraftEnCoursSurFactionAouBouC, 
            setPoolCartesGlobal, 
            setCartesValidees, 
            draftEnCoursParJoueurAouB, 
            draftEnCoursSurFactionAouBouC
        } = useKeyforgeContext();

        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const [currentDraftKeyforge, setCurrentDraftKeyforge] = useState(null);
        const [etapeDraft, setEtapeDraft] = useState(0);
        const [focusSurJoueurAouBforStats, setFocuSsurJoueurAouBforStats] = useState(null);
        const [factionsJA, setFactionsJA] = useState(null);
        const [factionsJB, setFactionsJB] = useState(null);

        const txtInstructionDraft = useMemo(() => {
            return recupKeyforgeTxtCurrentInstruction(etapeDraft, currentDraftKeyforge);
        }, [etapeDraft, currentDraftKeyforge]);

        const {
            handleClickOnPickBanFaction
        } = useDraftFactions({
            etapeDraft,
            setEtapeDraft,
            currentDraftKeyforge,
            updateFactionsCurrentDraft,
            setCurrentDraftKeyforge,
            setError,
            factionsJA,
            factionsJB,
            setFactionsJA,
            setFactionsJB
        });

    // Chargement des informations du draft passé en paramètre via slug
    useEffect(() => {
        const loadInitialData = async () => {
            if (!slug) return;
            setIsLoading(true);
            try {
                const draftData = await pullDraftKeyforge(slug);
                if (draftData?.length > 0) {
                    const draft = draftData[0];
                    const factionsList = await pullCurrentFactionsFromSet(draft.IDSet);

                    // Chargement anticipé des données du pool si le draft a commencé (Etat >= 10)
                    let poolData = [];
                    let validatedData = [];
                    if (draft.Etat >= 10) {
                        [poolData, validatedData] = await Promise.all([
                            pullCurrentDraftPoolCards(draft.ID),
                            pullCurrentDraftCardsSelected(draft.ID)
                        ]);
                    }

                    const pickedIDs = [
                        draft.FactionPickAJ1, draft.FactionPickBJ1, draft.FactionPickCJ1,
                        draft.FactionPickAJ2, draft.FactionPickBJ2, draft.FactionPickCJ2
                    ];
                    const bannedIFactions = [draft.FactionBanJ1, draft.FactionBanJ2];

                    const syncedFactions = factionsList.map(current => ({
                        ...current,
                        Picked: pickedIDs.includes(current.ID),
                        Banned: bannedIFactions.includes(current.ID)
                    }));

                    // Regroupement des mises à jour d'état
                    setCurrentDraftKeyforge(draftData);
                    setEtapeDraft(draft.Etat);
                    setDraftEnCoursParJoueurAouB(draft.DraftEnCoursPourJoueurAouB);
                    setDraftEnCoursSurFactionAouBouC(draft.DraftEnCoursSurFactionAouBouC);
                    setFactionsJA(syncedFactions);
                    setFactionsJB(syncedFactions);
                    setPoolCartesGlobal(poolData);
                    setCartesValidees(validatedData);
                }
            } catch (err) {
                console.error("Erreur chargement draft:", err);
                setError("Erreur de chargement");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [slug]);

    // En fin de phase picks/bans de faction, génération et push bdd du pool de cartes
    useEffect(() => {
    if (!currentDraftKeyforge?.[0]) return;

    const draft = currentDraftKeyforge[0];
    
    const isReady =
        draft.FactionPickAJ1 &&
        draft.FactionPickBJ1 &&
        draft.FactionPickCJ1 &&
        draft.FactionPickAJ2 &&
        draft.FactionPickBJ2 &&
        draft.FactionPickCJ2 &&
        etapeDraft === 9;
    console.log('isReady', isReady, draft);
    if (isReady) {
        processCreationPoolCartes(currentDraftKeyforge, setIsLoading);
    }
    }, [currentDraftKeyforge, etapeDraft]);

    // Creation du pool de cartes (en prévision de son upload en bdd + mise en state)
    const processCreationPoolCartes = async (currentDraftKeyforge, setIsLoading) => {
        try {
            await creationPoolCartes(currentDraftKeyforge, setIsLoading, setPoolCartesGlobal);
            setEtapeDraft(prev => prev + 1);
        } catch (e) {
            console.error(e);
            setError("Erreur lors de la création du pool de cartes");
        }
    }

    const modeDraftFaction = etapeDraft >= 1 && etapeDraft < 9;
    const isReadyToLaunchPhasePickBanFactions = currentDraftKeyforge && !modeDraftFaction && etapeDraft < 9
    const isPhasePickBanFactions = modeDraftFaction && etapeDraft < 9
    const j1isDrafting = etapeDraft == 2 || etapeDraft == 6 || etapeDraft == 7 || etapeDraft == 8
    const j2isDrafting = etapeDraft == 1 || etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5

    const isNotPickedAndNotBanned = (faction) => { 
        return !faction.Banned && !faction.Picked
    };

    const cssCurrentFactionPickedOrBanned = (faction) => { 
        return faction.Picked 
        ? "backgroundAnimGreenSmooth" 
        : faction.Banned && "backgroundAnimRed";
    };

    const phaseDeDraftParTrinomeEnCours = (draft, draftParJoueurAouB, etape) => {
        return draft && draftParJoueurAouB != null && etape > 9
    };

    const draftFactionsEnCours = (etape) => {
        return etape >= 1 && etape < 9
    };

    const factionsForPickBanCurrentPlayer = 
        j1isDrafting 
        ? factionsJA 
        : j2isDrafting 
            ? factionsJB 
            : null;

    return (
        <>
        {sessionUser ? <>
            <Tooltip content="Nombre de cartes validées">
                <button>Hover moi</button>
            </Tooltip>
            {/* Cadre top : resume */}
            <div className="container-xl mt-3">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mt-4 text-center txtColorWhite">Draft KeyForge</h2>
                    </div>
                </div>
                <DraftKeyforgeResume 
                    currentDraftKeyforge={currentDraftKeyforge} 
                    cusSurJoueurAouBforStats={focusSurJoueurAouBforStats}
                />
                
                {/* Bouton lancement phase picks/bans factions */}
                {isReadyToLaunchPhasePickBanFactions &&
                <div className="row">
                    <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                        <Button 
                            className={`btn btn-primary btn-ColorA`} 
                            onClick={() => {
                                setEtapeDraft(prev => prev + 1);
                                }
                            }>
                            Drafter les maisons
                        </Button>
                    </div>
                </div>
                }

                {/* Picks/bans des factions */}
                {isPhasePickBanFactions  && 
                <>
                    <div className="row">             
                        <div className="col-12 mt-1 justify-content-center">
                                <h6 className="mt-3 text-center txtColorWhite">
                                    Procédez au draft des maisons ...
                                </h6>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12 mt-4 d-flex justify-content-center">
                            <p>
                                {isPhasePickBanFactions && 
                                <>
                                    {factionsForPickBanCurrentPlayer?.map((current, index) => (
                                        <img key={`factionLogo-${current.ID}`} 
                                            src={current.LienImg} 
                                            alt="Logo de la faction" 
                                            className={`borderRadius6 
                                                ${styles.logoFactionBig} 
                                                backgroundAnimSurvol 
                                                ${cssCurrentFactionPickedOrBanned(current)}`} 
                                            onClick={() => {
                                            if (isNotPickedAndNotBanned(current)) {
                                                handleClickOnPickBanFaction(
                                                        current.ID, 
                                                        current.LienImg, 
                                                        current.Libelle, 
                                                        current.CouleurRGB
                                                    );
                                                }
                                            }}
                                        />
                                    ))}
                                </>}
                            </p>
                        </div>
                    </div>
                </>
                }

                {/* Draft par trinomes : boutons J1/J2*/}
                {etapeDraft >= 9 &&
                    <DraftKeyforgePartBoutonsJ1J2 
                        currentDraft={currentDraftKeyforge?.[0]}
                        setCurrentDraft={setCurrentDraftKeyforge}
                        draftTermine={etapeDraft >= 12}
                        focusAouBforStats={focusSurJoueurAouBforStats}
                        setfocusAouBforStats={setFocuSsurJoueurAouBforStats}
                    />
                }

                {/* Draft par trinomes */}
                {phaseDeDraftParTrinomeEnCours(currentDraftKeyforge, draftEnCoursParJoueurAouB, etapeDraft) && 
                    <div className={`${styles.EnteteDraft} mb-5`}>
                        <DraftKeyforgePartCardsSelection 
                            currentDraftKeyforge={currentDraftKeyforge} 
                            setCurrentDraftKeyforge={setCurrentDraftKeyforge} 
                            draftEnCoursParJoueurAouB={draftEnCoursParJoueurAouB} 
                            setdraftEnCoursParJoueurAouB={setDraftEnCoursParJoueurAouB} 
                            draftEnCoursSurFactionAouBouC={draftEnCoursSurFactionAouBouC} 
                            setDraftEnCoursSurFactionAouBouC={setDraftEnCoursSurFactionAouBouC}
                            setEtapeDraft={setEtapeDraft}
                        />
                    </div>
                }
            </div>
            {/* Bandeau d instruction du pick/ban factions bottom */}
            {draftFactionsEnCours(etapeDraft)  &&
                <div className={styles.bandeauInstructionDraft}>
                    <div className="col-12 d-flex justify-content-center txt-base">
                        {true &&
                            <h5 className="text-center">
                                <span className={`${txtInstructionDraft.colorPlayer}`}>
                                    <b>{txtInstructionDraft.txtPlayer}</b>
                                </span>
                                &nbsp;
                                <span className={`${txtInstructionDraft.colorInstruction}`}>
                                    {txtInstructionDraft.txtInstruction}
                                </span>
                            </h5>
                        }
                    </div>
                </div>
            }</> :
            <div className="row">
                {/* Warning connexion requise */}
                <div className="col-12 col-lg-12 mt-1 mb-5">
                    <h2 className="
                    mt-5 
                    text-center 
                    txtColorWhite"
                    >
                        Le module de deckbuilding Keyforge requiert d'être connecté.
                    </h2> 
                </div>
            </div>
            }
        </>
        )
    };

    export default DraftKeyforge;