    import {useState, useMemo, useEffect} from 'react';
    import styles from './draftKeyforge.module.css';
    import { useParams } from 'react-router-dom';
    import Loader from '../../components/others/Loader';
    import { Button } from 'react-bootstrap';
    import creationPoolCartes from '../../functions/keyforge/creationPoolCartes';
    import recupKeyforgeTxtCurrentInstruction from '../../functions/keyforge/recupKeyforgeTxtCurrentInstruction';
    import pullDraftKeyforge from '../../functions/callAPIx/keyforgePullDraftKeyforge';
    import pullCurrentFactionsFromSet from '../../functions/callAPIx/keyforgePullFactionsFromSet';
    import updateFocusSurJoueurAouB from '../../functions/callAPIx/keyforgeUpdateFocusSurJoueurAouB';
    import updateFactionsCurrentDraft from '../../functions/callAPIx/keyforgeUpdateFactionsSpecificDraft';
    import DraftKeyforgePartCardsSelection from '../../pages/keyforge/draftKeyforgePartCardsSelection';
    import updateEtapeDraft from '../../functions/callAPIx/keyforgeUpdateEtapeDraft';

    const DraftKeyforge = () => {
        const { slug } = useParams();
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const [currentDraftKeyforge, setCurrentDraftKeyforge] = useState(null);
        const [draftEnCoursParJoueurAouB, setDraftEnCoursParJoueurAouB] = useState(null);
        const [draftEnCoursSurFactionAouBouC, setDraftEnCoursSurFactionAouBouC] = useState(null);
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

        const modeDraftFaction = etapeDraft >= 1 && etapeDraft < 9;

        const txtInstructionDraft = useMemo(() => {
            return recupKeyforgeTxtCurrentInstruction(etapeDraft, currentDraftKeyforge);
        }, [etapeDraft, currentDraftKeyforge]);

    // Chargement des informations du draft passé en paramètre via slug
    
    useEffect(() => {
        let draftKeyforgePulled = null;
        const loadDraft = async () => {
            if (slug) {
                draftKeyforgePulled = await pullDraftKeyforge(slug);

                if (draftKeyforgePulled && Array.isArray(draftKeyforgePulled) && draftKeyforgePulled.length > 0) {

                        setCurrentDraftKeyforge(draftKeyforgePulled);
                        setEtapeDraft(draftKeyforgePulled[0].Etat);
                        setDraftEnCoursParJoueurAouB(draftKeyforgePulled[0].DraftEnCoursPourJoueurAouB);
                        setDraftEnCoursSurFactionAouBouC(draftKeyforgePulled[0].DraftEnCoursSurFactionAouBouC);
                        loadFactions(draftKeyforgePulled);
                } else {
                    setCurrentDraftKeyforge(null);
                }
            }
        };

        loadDraft();

        const loadFactions = async (myDraftKeyforge) => {
            if (myDraftKeyforge) {
                const draft = myDraftKeyforge[0];
                const factions = await pullCurrentFactionsFromSet(myDraftKeyforge[0].IDSet);
                
                const pickedIDs = [
                    draft.FactionPickAJ1, draft.FactionPickBJ1, draft.FactionPickCJ1,
                    draft.FactionPickAJ2, draft.FactionPickBJ2, draft.FactionPickCJ2
                ];
                const bannedIDs = [draft.FactionBanJ1, draft.FactionBanJ2];

                const syncFactions = (list) => list.map(f => ({
                    ...f,
                    Picked: pickedIDs.includes(f.ID),
                    Banned: bannedIDs.includes(f.ID)
                }));

                setfactionsForCurrentDraftKeyforgeJA(syncFactions(factions));
                setfactionsForCurrentDraftKeyforgeJB(syncFactions(factions));
            }
        }

    }, [slug]);

    // En fin de phase picks/bans de faction, génération et push bdd du pool de cartes

    useEffect(() => {
        if(currentDraftKeyforge?.[0].FactionPickAJ1 && currentDraftKeyforge?.[0].FactionPickBJ1 && currentDraftKeyforge?.[0].FactionPickCJ1 && currentDraftKeyforge?.[0].FactionPickAJ2 && currentDraftKeyforge?.[0].FactionPickBJ2 && currentDraftKeyforge?.[0].FactionPickCJ2 && etapeDraft == 9) 
        {
            processCreationPoolCartes(currentDraftKeyforge, setIsLoading);
        }
    }, [currentDraftKeyforge?.[0].FactionPickAJ1]);

    const processCreationPoolCartes = async (currentDraftKeyforge, setIsLoading) => {
        try {
            await creationPoolCartes(currentDraftKeyforge, setIsLoading);
            setEtapeDraft(prev => prev + 1);
        } catch (e) {
            console.error(e);
            setError("Erreur lors de la création du pool de cartes");
        }
    }

    // Phase de picks/bans factions pour J1/J2

    const handleClickOnPickBanFaction = (idFaction, LienImgFaction) => {
        if (etapeDraft == 1) 
        {
            setfactionsForCurrentDraftKeyforgeJB(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
            prevFaction.ID === idFaction
            ? {...prevFaction,
                Banned: !prevFaction.Banned}
            : prevFaction
        ))
        setFactionPickBan(prev => ({
            ...prev,
            factionBanJ2: idFaction
        }));
        } else if (etapeDraft == 2) 
        {
            setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
            prevFaction.ID === idFaction
            ? {...prevFaction,
                Banned: !prevFaction.Banned}
            : prevFaction
        ))
        setFactionPickBan(prev => ({
            ...prev,
            factionBanJ1: idFaction
        }));
        } else if (etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5) 
        {
            setfactionsForCurrentDraftKeyforgeJB(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
            prevFaction.ID === idFaction
            ? {...prevFaction,
                Picked: !prevFaction.Picked}
            : prevFaction
            ))

            switch (etapeDraft) {
                case 3:
                    setFactionPickBan(prev => ({
                        ...prev,
                        factionPickAJ2: idFaction,
                        factionPickAJ2LienImg: LienImgFaction
                    }));
                    break;
                case 4:
                    setFactionPickBan(prev => ({
                        ...prev,
                        factionPickBJ2: idFaction,
                        factionPickBJ2LienImg: LienImgFaction
                    }));
                    break;
                case 5:
                    setFactionPickBan(prev => ({
                        ...prev,
                        factionPickCJ2: idFaction,
                        factionPickCJ2LienImg: LienImgFaction
                    }));
                    break;
            } 
        } else if (etapeDraft == 6 || etapeDraft == 7)
        {
            setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
            prevFaction.ID === idFaction
            ? {...prevFaction,
                Picked: !prevFaction.Picked}
            : prevFaction
        ))
        switch (etapeDraft) {
            case 6:
                setFactionPickBan(prev => ({
                    ...prev,
                    factionPickAJ1: idFaction,
                    factionPickAJ1LienImg: LienImgFaction
                }));
                break;
            case 7:
                setFactionPickBan(prev => ({
                    ...prev,
                    factionPickBJ1: idFaction,
                    factionPickBJ1LienImg: LienImgFaction
                }));
                break;
        }
        
        } else if (etapeDraft == 8)
        {
            processPicksBansFactions(idFaction, LienImgFaction);
        }
    };  

    // Saisie en base de données des factions picks et bans + en cas de succès -> refresh useStates
    const processPicksBansFactions = async (idFaction, LienImgFaction) => {
            try {
                const tempoFactionPickBan = {
                    ...factionsPickBan,
                    factionPickCJ1: idFaction,
                    factionPickCJ1LienImg: LienImgFaction
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
                    tempoFactionPickBan.factionPickCJ2LienImg);
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
                    Etat: 10
                }]);
            } catch(e) {
                console.error(e);
                setError("Erreur lors de la mise à jour");
            }
    }


    return (
            <>
            <div className="container-xl mt-3">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mt-4 text-center txtColorWhite">Draft KeyForge</h2>
                    </div>
                </div>
                <div className={`mb-4 ${styles.EnteteDraft}`}>
                    <div className="col-12 d-flex justify-content-center">
                            <h4 className="text-center txtColorWhite">{currentDraftKeyforge?.[0]?.Titre ?? "---"}</h4>
                    </div>
                    <div className="row">
                        {/* Labels du draft en cours */}
                        <div className="col-2 mt-2">
                            <div className="col-12 ps-4">
                                <p className="txtBold">Date de création</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Date de mise à jour</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Joueur A</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Maisons joueur A</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Joueur B</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Maisons joueur B</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Set</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Anomalies</p>
                            </div>
                            <div className="col-12 ps-4">
                                <p className="txtBold">Avancement</p>
                            </div>
                        </div>
                        <div className="col-2 mt-2">
                            {/* Infos du draft en cours */}
                            {currentDraftKeyforge ? 
                            <>
                            {currentDraftKeyforge?.map((current, index) => (
                            <div key={current.ID}>
                                <div className="col-12,">
                                    <p className="txtColorWhite">{new Date(current.DateCreation).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">{new Date(current.DateDerModif).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">{current.PseudoJ1}</p>
                                </div>
                                    <p>
                                        <img 
                                            src={current.LienImgAJ1 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction A du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={current.LienImgBJ1 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction B du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={current.LienImgCJ1 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction C du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                    </p>
                                <div className="col-12">
                                    <p className="txtColorWhite">{current.PseudoJ2}</p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <img 
                                            src={current.LienImgAJ2 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction A du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={current.LienImgBJ2 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction B du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={current.LienImgCJ2 || "/images/keyforge/NC.png"} 
                                            alt="Logo de la faction C du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">{current.Libelle + " (" + current.Numero + ")"}</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">{current.AvecAnomalies ? "Avec" : "Sans"}</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">{current.Etat == 0 ? "Maisons à renseigner" : current.Etat == 10 ? "Draft prêt" : current.Etat}</p>
                                </div>
                            </div>
                        ))}</>
                        :
                            <div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                    <p>
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction A du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction B du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction C du joueur 1" 
                                            className={styles.logoFaction}
                                        />
                                    </p>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction A du joueur 2" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction B du joueur 2" 
                                            className={styles.logoFaction}
                                        />
                                        <img 
                                            src={"/images/keyforge/NC.png"} 
                                            alt="Logo de la faction C du joueur 2" 
                                            className={styles.logoFaction}
                                        />
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                                <div className="col-12">
                                    <p className="txtColorWhite">---</p>
                                </div>
                            </div>
                        }

                        </div>
                        <div className="col-8 mt-2 borderLeft1pxColE">
                        </div>
                    </div>
                </div>
                
                {/* Picks/bans des factions */}
                {currentDraftKeyforge && !modeDraftFaction && etapeDraft < 9 &&
                <div className="row">
                    <div className="col-12 mt-4 mb-5 d-flex justify-content-center">
                        <Button className={`btn btn-primary btn-ColorA`} onClick={() => {setEtapeDraft(prev => prev + 1);}}>
                            Drafter les maisons
                        </Button>
                    </div>
                </div>
                }

                {modeDraftFaction && etapeDraft < 9 && 
                <>
                    <div className="row">             
                        <div className="col-12 mt-1 justify-content-center">
                                <h6 className="mt-3 text-center txtColorWhite">Procédez au draft des maisons ...</h6>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12 mt-4 d-flex justify-content-center">
                            <p>
                                {(etapeDraft == 2 || etapeDraft == 6 || etapeDraft == 7 || etapeDraft == 8) && 
                                <>
                                    {factionsForCurrentDraftKeyforgeJA?.map((current, index) => (
                                        <img key={`factionLogoA-${current.ID}`} 
                                            src={current.LienImg} 
                                            alt="Logo de la faction A du joueur 1" 
                                            className={`borderRadius6 ${styles.logoFactionBig} backgroundAnimSurvol ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} 
                                            onClick={() => {
                                            if (!current.Banned && !current.Picked) {
                                                setEtapeDraft(prev => prev + 1);
                                                handleClickOnPickBanFaction(current.ID, current.LienImg);
                                            }
                                            }}
                                        />
                                    ))}
                                </>}

                                {(etapeDraft == 1 || etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5) && 
                                <>
                                    {factionsForCurrentDraftKeyforgeJB?.map((current, index) => (
                                        <img key={`factionLogoB-${current.ID}`} 
                                            src={current.LienImg} 
                                            alt="Logo de la faction A du joueur 1" 
                                            className={`borderRadius6 ${styles.logoFactionBig} backgroundAnimSurvol ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} 
                                            onClick={() => {
                                            if (!current.Banned && !current.Picked) {
                                                setEtapeDraft(prev => prev + 1);
                                                handleClickOnPickBanFaction(current.ID, current.LienImg);
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

                {/* Draft par trinomes */}
                {etapeDraft >= 10 &&
                <div className="row mb-4">
                    <div className="col-6 mt-4 mb-4 d-flex justify-content-center">
                        <Button 
                            className={`btn btn-primary ${currentDraftKeyforge[0].DraftJ1Finished == true ? "btn-ColorFinished" : draftEnCoursParJoueurAouB == 1 ? "btn-ColorInactif" : draftEnCoursParJoueurAouB == 0 ? "btn-ColorAFocused" : "btn-ColorA"} btn-lg`} 
                            disabled={draftEnCoursParJoueurAouB == 1} 
                            onClick={currentDraftKeyforge[0].DraftJ1Finished == true ? null : async () => {
                                try {
                                    await updateFocusSurJoueurAouB(
                                    currentDraftKeyforge[0].ID,
                                    0
                                    );
                                    // Je devrais fusionner cette partie avec le updateFocusSurJoueurAouB, comme ca si cela plante, on est bueno)
                                    await updateEtapeDraft(
                                    currentDraftKeyforge[0].ID,
                                    11
                                    );

                                    setCurrentDraftKeyforge(prev => [
                                    {
                                        ...prev[0],
                                        DraftEnCoursPourJoueurAouB: 0,
                                        Etat: 11
                                    }
                                    ]);

                                    setDraftEnCoursParJoueurAouB(0);

                                } catch (e) {
                                    console.error(e);
                                }
                                }
                            }
                        >
                            {"Commencer le draft de " + currentDraftKeyforge[0]?.PseudoJ1}
                        </Button>
                    </div>
                    <div className="col-6 mt-4 mb-4 d-flex justify-content-center">
                        <Button 
                            className={`btn btn-primary ${currentDraftKeyforge[0].DraftJ2Finished == true ? "btn-ColorFinished" : draftEnCoursParJoueurAouB == 0 ? "btn-ColorInactif" : draftEnCoursParJoueurAouB == 1 ? "btn-ColorAFocused" : "btn-ColorA"} btn-lg`} 
                            disabled={draftEnCoursParJoueurAouB == 0} 
                            onClick={currentDraftKeyforge[0].DraftJ2Finished == true ? null : async () => {
                                try {
                                    await updateFocusSurJoueurAouB(
                                    currentDraftKeyforge[0].ID,
                                    1
                                    );

                                    await updateEtapeDraft(
                                    currentDraftKeyforge[0].ID,
                                    11
                                    );

                                    setCurrentDraftKeyforge(prev => [
                                    {
                                        ...prev[0],
                                        DraftEnCoursPourJoueurAouB: 1,
                                        Etat: 11
                                    }
                                    ]);

                                    setDraftEnCoursParJoueurAouB(1);

                                } catch (e) {
                                    console.error(e);
                                }
                                }
                            }
                        >
                            {"Commencer le draft de " + currentDraftKeyforge[0]?.PseudoJ2}
                        </Button>
                    </div>
                </div>
                }

                {currentDraftKeyforge && draftEnCoursParJoueurAouB != null && etapeDraft > 9 && 
                    <div className={`${styles.EnteteDraft} mb-5`}>
                        <DraftKeyforgePartCardsSelection 
                            currentDraftKeyforge={currentDraftKeyforge} 
                            setCurrentDraftKeyforge={setCurrentDraftKeyforge} 
                            draftEnCoursParJoueurAouB={draftEnCoursParJoueurAouB} 
                            setdraftEnCoursParJoueurAouB={setDraftEnCoursParJoueurAouB} 
                            draftEnCoursSurFactionAouBouC={draftEnCoursSurFactionAouBouC} 
                            setDraftEnCoursSurFactionAouBouC={setDraftEnCoursSurFactionAouBouC}/>
                    </div>
                }
            </div>
            {etapeDraft >= 1 && etapeDraft < 9  &&
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
            }
            </>
        )
    };

    export default DraftKeyforge;