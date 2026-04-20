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
        const [factionsForCurrentDraftKeyforgeJA, setfactionsForCurrentDraftKeyforgeJA] = useState(null);
        const [factionsForCurrentDraftKeyforgeJB, setfactionsForCurrentDraftKeyforgeJB] = useState(null);
        const [factionsPickBan, setFactionPickBan] = useState({
            factionBanJ1: "", 
            factionPickAJ1: "", 
            factionPickBJ1: "", 
            factionPickCJ1: "", 
            factionBanJ2: "", 
            factionPickAJ2: "", 
            factionPickBJ2: "", 
            factionPickCJ2: ""
        });
        const [etapeDraft, setEtapeDraft] = useState(0);
        const [focusSurJoueurAouBforStats, setFocuSsurJoueurAouBforStats] = useState(null);
        
        const modeDraftFaction = etapeDraft >= 1 && etapeDraft < 9;

        const txtInstructionDraft = useMemo(() => {
            return recupKeyforgeTxtCurrentInstruction(etapeDraft, currentDraftKeyforge);
        }, [etapeDraft, currentDraftKeyforge]);

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
                    setfactionsForCurrentDraftKeyforgeJA(syncedFactions);
                    setfactionsForCurrentDraftKeyforgeJB(syncedFactions);
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
    }, [slug, setDraftEnCoursParJoueurAouB, setDraftEnCoursSurFactionAouBouC, setPoolCartesGlobal, setCartesValidees]);

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

    if (isReady) {
        processCreationPoolCartes(currentDraftKeyforge, setIsLoading);
    }
    }, [currentDraftKeyforge, etapeDraft]);

    const processCreationPoolCartes = async (currentDraftKeyforge, setIsLoading) => {
        try {
            await creationPoolCartes(currentDraftKeyforge, setIsLoading, setPoolCartesGlobal);
            setEtapeDraft(prev => prev + 1);
        } catch (e) {
            console.error(e);
            setError("Erreur lors de la création du pool de cartes");
        }
    }

    const draftStepsConfig = {
        1: { type: "Banned", player: "J2", cleSetter: "factionBanJ2" },
        2: { type: "Banned", player: "J1", cleSetter: "factionBanJ1" },
        3: { type: "Picked", player: "J2", slot: "A", cleSetter: "factionPickAJ2", cleSetterBisA: "factionPickAJ2LienImg", cleSetterBisB: "libelleFactionAJ2", cleSetterBisC: "couleurAJ2" },
        4: { type: "Picked", player: "J2", slot: "B", cleSetter: "factionPickBJ2", cleSetterBisA: "factionPickBJ2LienImg", cleSetterBisB: "libelleFactionBJ2", cleSetterBisC: "couleurBJ2" },
        5: { type: "Picked", player: "J2", slot: "C", cleSetter: "factionPickCJ2", cleSetterBisA: "factionPickCJ2LienImg", cleSetterBisB: "libelleFactionCJ2", cleSetterBisC: "couleurCJ2" },
        6: { type: "Picked", player: "J1", slot: "A", cleSetter: "factionPickAJ1", cleSetterBisA: "factionPickAJ1LienImg", cleSetterBisB: "libelleFactionAJ1", cleSetterBisC: "couleurAJ1" },
        7: { type: "Picked", player: "J1", slot: "B", cleSetter: "factionPickBJ1", cleSetterBisA: "factionPickBJ1LienImg", cleSetterBisB: "libelleFactionBJ1", cleSetterBisC: "couleurBJ1" }
    };

    const step = draftStepsConfig[etapeDraft];

    const setfactionsForCurrentDraftKeyforge = {
    J1: setfactionsForCurrentDraftKeyforgeJA,
    J2: setfactionsForCurrentDraftKeyforgeJB,
    };

    // Phase de picks/bans factions pour J1/J2
    const handleClickOnPickBanFaction = (idFaction, LienImgFaction, NomFaction, CouleurFaction) => {
        if (!step) return;
        if(etapeDraft < 8) {
            setfactionsForCurrentDraftKeyforge[step.player](prevListeFactions => 
                prevListeFactions?.map(prevFaction =>
                prevFaction.ID === idFaction
                ? {...prevFaction,
                    [step.type]: !prevFaction[step.type]}
                : prevFaction
            ))

            setFactionPickBan(prev => ({
                ...prev,

                ...(step.cleSetter && {
                    [step.cleSetter]: idFaction
                }),

                ...(step.cleSetterBisA && {
                    [step.cleSetterBisA]: LienImgFaction
                }),

                ...(step.cleSetterBisB && {
                    [step.cleSetterBisB]: NomFaction
                }),

                ...(step.cleSetterBisC && {
                    [step.cleSetterBisC]: CouleurFaction
                }),
            }));
        }  
        else if (etapeDraft == 8)
        {
            processPicksBansFactions(idFaction, LienImgFaction, NomFaction, CouleurFaction);
        }
    };  

    // Saisie en base de données des factions picks et bans + en cas de succès -> refresh useStates
    const processPicksBansFactions = async (idFaction, LienImgFaction, NomFaction, CouleurFaction) => {
            try {
                const tempoFactionPickBan = {
                    ...factionsPickBan,
                        factionPickCJ1: idFaction,
                        factionPickCJ1LienImg: LienImgFaction,
                        libelleFactionCJ1: NomFaction,
                        couleurCJ1: CouleurFaction
                }
                await updateFactionsCurrentDraft(currentDraftKeyforge[0].ID, 
                    tempoFactionPickBan.factionBanJ1, 
                    tempoFactionPickBan.factionPickAJ1, 
                    tempoFactionPickBan.factionPickBJ1, 
                    tempoFactionPickBan.factionPickCJ1, 
                    tempoFactionPickBan.factionBanJ2, 
                    tempoFactionPickBan.factionPickAJ2, 
                    tempoFactionPickBan.factionPickBJ2, 
                    tempoFactionPickBan.factionPickCJ2, 
                    tempoFactionPickBan.factionPickAJ1LienImg, 
                    tempoFactionPickBan.factionPickBJ1LienImg, 
                    tempoFactionPickBan.factionPickCJ1LienImg, 
                    tempoFactionPickBan.factionPickAJ2LienImg, 
                    tempoFactionPickBan.factionPickBJ2LienImg, 
                    tempoFactionPickBan.factionPickCJ2LienImg,
                    tempoFactionPickBan.couleurAJ1,
                    tempoFactionPickBan.couleurBJ1,
                    tempoFactionPickBan.couleurCJ1,
                    tempoFactionPickBan.couleurAJ2,
                    tempoFactionPickBan.couleurBJ2,
                    tempoFactionPickBan.couleurCJ2,
                    tempoFactionPickBan.libelleFactionAJ1,
                    tempoFactionPickBan.libelleFactionBJ1,
                    tempoFactionPickBan.libelleFactionCJ1,
                    tempoFactionPickBan.libelleFactionAJ2,
                    tempoFactionPickBan.libelleFactionBJ2,
                    tempoFactionPickBan.libelleFactionCJ2);
                setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
                    prevListeFactions?.map(prevFaction =>
                    prevFaction.ID === idFaction
                    ? {...prevFaction,
                        Picked: !prevFaction.Picked}
                    : prevFaction
                ))
                setFactionPickBan(tempoFactionPickBan);
                setCurrentDraftKeyforge(prev => [{
                    ...prev[0], 
                    FactionBanJ1: tempoFactionPickBan.factionBanJ1,
                    FactionBanJ2: tempoFactionPickBan.factionBanJ2,
                    FactionPickAJ1: tempoFactionPickBan.factionPickAJ1,
                    FactionPickBJ1: tempoFactionPickBan.factionPickBJ1,
                    FactionPickCJ1: tempoFactionPickBan.factionPickCJ1,
                    FactionPickAJ2: tempoFactionPickBan.factionPickAJ2,
                    FactionPickBJ2: tempoFactionPickBan.factionPickBJ2,
                    FactionPickCJ2: tempoFactionPickBan.factionPickCJ2,
                    LienImgAJ1: tempoFactionPickBan.factionPickAJ1LienImg,
                    LienImgBJ1: tempoFactionPickBan.factionPickBJ1LienImg,
                    LienImgCJ1: tempoFactionPickBan.factionPickCJ1LienImg,
                    LienImgAJ2: tempoFactionPickBan.factionPickAJ2LienImg,
                    LienImgBJ2: tempoFactionPickBan.factionPickBJ2LienImg,
                    LienImgCJ2: tempoFactionPickBan.factionPickCJ2LienImg,
                    CouleurAJ1: tempoFactionPickBan.couleurAJ1,
                    CouleurBJ1: tempoFactionPickBan.couleurBJ1,
                    CouleurCJ1: tempoFactionPickBan.couleurCJ1,
                    CouleurAJ2: tempoFactionPickBan.couleurAJ2,
                    CouleurBJ2: tempoFactionPickBan.couleurBJ2,
                    CouleurCJ2: tempoFactionPickBan.couleurCJ2,
                    LibelleFactionAJ1: tempoFactionPickBan.libelleFactionAJ1,
                    LibelleFactionBJ1: tempoFactionPickBan.libelleFactionBJ1,
                    LibelleFactionCJ1: tempoFactionPickBan.libelleFactionCJ1,
                    LibelleFactionAJ2: tempoFactionPickBan.libelleFactionAJ2,
                    LibelleFactionBJ2: tempoFactionPickBan.libelleFactionBJ2,
                    LibelleFactionCJ2: tempoFactionPickBan.libelleFactionCJ2,
                    Etat: 10
                }]);
            } catch(e) {
                console.error(e);
                setError("Erreur lors de la mise à jour");
            }
    }

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
        ? factionsForCurrentDraftKeyforgeJA 
        : j2isDrafting && factionsForCurrentDraftKeyforgeJB;


    return (
        <>
        {sessionUser ? <>
            <Tooltip content="Nombre de cartes validées">
                <button>Hover moi</button>
            </Tooltip>
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
                                                    setEtapeDraft(prev => prev + 1);
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
                {etapeDraft >= 10 &&
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