    import {useState, useRef, useEffect} from 'react';
    import styles from './draftKeyforge.module.css';
    import { useParams } from 'react-router-dom';
    import { useSessionUserContext } from '../../components/contexts/sessionUserContext';
    import { useOngletAlerteContext } from '../../components/contexts/ToastContext';
    import Loader from '../../components/others/Loader';
    import { Button } from 'react-bootstrap';

    const DraftKeyforge = () => {
        const { slug } = useParams();
        const [isLoading, setIsLoading] = useState(true);
        const [modeDraftFaction, setModeDraftFaction] = useState(false);
        const [currentDraftKeyforge, setCurrentDraftKeyforge] = useState(null);
        const [factionsForCurrentDraftKeyforgeJA, setfactionsForCurrentDraftKeyforgeJA] = useState(null);
        const [factionsForCurrentDraftKeyforgeJB, setfactionsForCurrentDraftKeyforgeJB] = useState(null);
        const [factionsPickBan, setFactionPickBan] = useState({factionBanJ1: "", factionPickAJ1: "", factionPickBJ1: "", factionPickCJ1: "", factionBanJ2: "", factionPickAJ2: "", factionPickBJ2: "", factionPickCJ2: ""});
        const [draftNotExist, setDraftNotExist] = useState(null);
        const [showModalNewDraftKeyforge, setShowModalNewDraftKeyforge] = useState(false);
        const [etapeDraft, setEtapeDraft] = useState(0);
        const [txtCurrentInstruction, setTxtCurrentInstruction] = useState("XXX");
        const [txtCurrentInstructionColor, setTxtCurrentInstructionColor] = useState("txtClignoteRed");
        const [txtCurrentPlayer, setTxtCurrentPlayer] = useState("XXX");
        const [txtCurrentPlayerColor, setTxtCurrentPlayerColor] = useState("XXX");
        const [factionsPickBanByPlayer, setFactionsPickBanByPlayer] = useState([]);

    useEffect(() => {
        if(currentDraftKeyforge) {
            if (etapeDraft == 1) {
                setTxtCurrentPlayer(currentDraftKeyforge[0].PseudoJ1);
                setTxtCurrentInstruction("doit bannir une maison");
            } else if (etapeDraft == 2) {
                setTxtCurrentPlayer(currentDraftKeyforge[0].PseudoJ2);
                setTxtCurrentInstruction("doit bannir une maison");
            } else if (etapeDraft == 3) {
                setTxtCurrentInstructionColor("txtClignoteGreen");
                setTxtCurrentInstruction("doit choisir sa première maison");
            } else if (etapeDraft == 4) {
                setTxtCurrentInstruction("doit choisir sa seconde maison");
            } else if (etapeDraft == 5) {
                setTxtCurrentInstruction("doit choisir sa dernière maison");
            } else if (etapeDraft == 6) {
                setTxtCurrentPlayer(currentDraftKeyforge[0].PseudoJ1);
                setTxtCurrentInstruction("doit choisir sa première maison");
            } else if (etapeDraft == 7) {
                setTxtCurrentInstruction("doit choisir sa seconde maison");
            } else if (etapeDraft == 8) {
                setTxtCurrentInstruction("doit choisir sa dernière maison");
            }
        };
    }, [etapeDraft])

    const creationPoolCartes = (arrayCartes, codeFaction) => {
        console.log('currentDraft', currentDraftKeyforge);
        fetch(`/api/keyforge/basePoolCartes?factions=${currentDraftKeyforge?.[0]?.FactionPickAJ1},${currentDraftKeyforge?.[0]?.FactionPickBJ1},${currentDraftKeyforge?.[0]?.FactionPickCJ1}, ${currentDraftKeyforge?.[0]?.FactionPickAJ2},${currentDraftKeyforge?.[0]?.FactionPickBJ2}, ${currentDraftKeyforge?.[0]?.FactionPickCJ2}`)
        .then(response => response.json())
        .then(data => {
            console.log("cartes", data);
            const poolCartesAJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickAJ1);
            const poolCartesBJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickBJ1);
            const poolCartesCJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickCJ1);
            const poolCartesAJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickAJ2);
            const poolCartesBJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickBJ2);
            const poolCartesCJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickCJ2);
            console.log("poolCartesAJ1", poolCartesAJ1)
            console.log("poolCartesBJ1", poolCartesBJ1)
            console.log("poolCartesCJ1", poolCartesCJ1)
            console.log("poolCartesAJ2", poolCartesAJ2)
            console.log("poolCartesBJ2", poolCartesBJ2)
            console.log("poolCartesCJ2", poolCartesCJ2)
            setIsLoading(false);
        }).catch(error => console.error('Erreur fetch keyforge drafts:', error));
    }

    const splitCardsByFaction = (arrayCartes, codeFaction) => {
        return arrayCartes.filter(prev => prev.Faction === codeFaction);
    }



    useEffect(() => {
    setIsLoading(true);
    const fetchDraftKeyforge = async () => {
        try {
        const res = await fetch(`/api/keyforge/draftKeyforge/${slug}`);
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (data && Array.isArray(data) && data.length > 0) {
            setCurrentDraftKeyforge(data);
            setDraftNotExist(!data[0].ID);
        } else {
            setCurrentDraftKeyforge(null);
            setDraftNotExist(true);
        }

        } catch (err) {
        console.error('Erreur fetch article:', err);
        setCurrentDraftKeyforge(null);
        setDraftNotExist(true);
        } finally {
        setIsLoading(false);
        }
    };

    if (slug) {
        fetchDraftKeyforge();
    };
    }, [slug]);

    useEffect(() => {
        if (currentDraftKeyforge) {
            setIsLoading(true);
            fetch(`/api/keyforge/factionsFromSet?setId=` + currentDraftKeyforge[0].IDSet)
            .then(response => response.json())
            .then(data => {
                setfactionsForCurrentDraftKeyforgeJA(data);
                setfactionsForCurrentDraftKeyforgeJB(data);
                setIsLoading(false);
            }).catch(error => console.error('Erreur fetch keyforge liste factions :', error));
        }
    }, [currentDraftKeyforge]);

    const handleClickOnPickBanFaction = (idFaction, LienImgFaction) => {
        setFactionsPickBanByPlayer((prev) => ({
            ...prev,
            [etapeDraft -1]: idFaction,
        }));

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
        setFactionPickBan(prev => ({
            ...prev,
            factionBanJ2: idFaction
        }));  
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
            setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
            prevListeFactions?.map(prevFaction =>
            prevFaction.ID === idFaction
            ? {...prevFaction,
                Picked: !prevFaction.Picked}
            : prevFaction
        ))
            const tempoFactionPickBan = {
                ...factionsPickBan,
                factionPickCJ1: idFaction,
                factionPickCJ1LienImg: LienImgFaction
            }
            setFactionPickBan(tempoFactionPickBan);
        updateFactionsCurrentDraft(currentDraftKeyforge[0].ID, tempoFactionPickBan.factionBanJ1, tempoFactionPickBan.factionPickAJ1, tempoFactionPickBan.factionPickBJ1, tempoFactionPickBan.factionPickCJ1, tempoFactionPickBan.factionBanJ2, tempoFactionPickBan.factionPickAJ2, tempoFactionPickBan.factionPickBJ2, tempoFactionPickBan.factionPickCJ2, tempoFactionPickBan.factionPickAJ1LienImg, tempoFactionPickBan.factionPickBJ1LienImg, tempoFactionPickBan.factionPickCJ1LienImg, tempoFactionPickBan.factionPickAJ2LienImg, tempoFactionPickBan.factionPickBJ2LienImg, tempoFactionPickBan.factionPickCJ2LienImg);
        }
    };  

    const updateFactionsCurrentDraft = async (idDraft, factionBanJ1, factionPickAJ1, factionPickBJ1, factionPickCJ1, factionBanJ2, factionPickAJ2, factionPickBJ2, factionPickCJ2, factionPickAJ1LienImg, factionPickBJ1LienImg, factionPickCJ1LienImg, factionPickAJ2LienImg, factionPickBJ2LienImg, factionPickCJ2LienImg) => {
            try {
            const response = await fetch("/api/keyforge/updateFactionsSpecificDraft", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ parID: idDraft, parFactionBanJ1: factionBanJ1, parFactionBanJ2: factionBanJ2, parFactionPickAJ1: factionPickAJ1, parFactionPickBJ1: factionPickBJ1, parFactionPickCJ1: factionPickCJ1, parFactionPickAJ2: factionPickAJ2, parFactionPickBJ2: factionPickBJ2, parFactionPickCJ2: factionPickCJ2 })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
            }

            setCurrentDraftKeyforge(prev => [{
                ...prev[0], 
                FactionBanJ1: factionBanJ1,
                FactionBanJ2: factionBanJ2,
                FactionPickAJ1: factionPickAJ1,
                FactionPickBJ1: factionPickBJ1,
                FactionPickCJ1: factionPickCJ1,
                FactionPickAJ2: factionPickAJ2,
                FactionPickBJ2: factionPickBJ2,
                FactionPickCJ2: factionPickCJ2,
                LienImgAJ1: factionPickAJ1LienImg,
                LienImgBJ1: factionPickBJ1LienImg,
                LienImgCJ1: factionPickCJ1LienImg,
                LienImgAJ2: factionPickAJ2LienImg,
                LienImgBJ2: factionPickBJ2LienImg,
                LienImgCJ2: factionPickCJ2LienImg,
                Etat: 8
            }]);
            } catch (err) {
            console.error("Erreur lors de la mise à jour du draft KeyForge :", err);
            }
    }

    return (
            <><div class="red" onClick={(e) => creationPoolCartes()}>LANCER TEST</div>
            <div className="container-xl mt-3">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mt-4 text-center txtColorWhite">Draft KeyForge</h2>
                    </div>
                </div>
                <div className={styles.EnteteDraft}>
                    <div className="col-12 mt-2 d-flex justify-content-center">
                        {currentDraftKeyforge?.map((current, index) => (
                            <h4 key={"currentDraft" + current.ID} className="text-center txtColorWhite">{current.Titre}</h4>
                        ))}
                    </div>
                    {isLoading ?
                            <Loader/> : <>
                    {currentDraftKeyforge?.map((current, index) => (
                    <div className="row" key={"currentDraft" + current.ID}>
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
                            <div className="col-12">
                                <p className="txtColorWhite">{new Date(current.DateCreation).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="col-12">
                                <p className="txtColorWhite">{new Date(current.DateDerModif).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="col-12">
                                <p className="txtColorWhite">{current.PseudoJ1}</p>
                            </div>
                                <p>
                                    <img src={current.LienImgAJ1 || "/images/keyforge/NC.png"} alt="Logo de la faction A du joueur 1" className={styles.logoFaction}></img>
                                    <img src={current.LienImgBJ1 || "/images/keyforge/NC.png"} alt="Logo de la faction B du joueur 1" className={styles.logoFaction}></img>
                                    <img src={current.LienImgCJ1 || "/images/keyforge/NC.png"} alt="Logo de la faction C du joueur 1" className={styles.logoFaction}></img>
                                </p>
                            <div className="col-12">
                                <p className="txtColorWhite">{current.PseudoJ2}</p>
                            </div>
                            <div className="col-12">
                                <p>
                                    <img src={current.LienImgAJ2 || "/images/keyforge/NC.png"} alt="Logo de la faction A du joueur 1" className={styles.logoFaction}></img>
                                    <img src={current.LienImgBJ2 || "/images/keyforge/NC.png"} alt="Logo de la faction B du joueur 1" className={styles.logoFaction}></img>
                                    <img src={current.LienImgCJ2 || "/images/keyforge/NC.png"} alt="Logo de la faction C du joueur 1" className={styles.logoFaction}></img>
                                </p>
                            </div>
                            <div className="col-12">
                                <p className="txtColorWhite">{current.Libelle + " (" + current.Numero + ")"}</p>
                            </div>
                            <div className="col-12">
                                <p className="txtColorWhite">{current.AvecAnomalies ? "Avec" : "Sans"}</p>
                            </div>
                            <div className="col-12">
                                <p className="txtColorWhite">{current.Etat}</p>
                            </div>
                        </div>
                        <div className="col-8 mt-2 borderLeft1pxColE">
                        </div>
                    </div>
                    ))}</>}
                </div>
                {!modeDraftFaction && etapeDraft < 1 &&
                <div className="row">
                    <div className="col-12 mt-4 d-flex justify-content-center">
                        <Button className={`btn btn-primary btn-ColorA`} onClick={() => {setModeDraftFaction(true); setEtapeDraft(prev => prev + 1);}}>
                            Drafter les maisons
                        </Button>
                    </div>
                </div>
                }
                {modeDraftFaction && etapeDraft < 9 && 
                <>
                    <div className="row">             
                        <div className="col-12 mt-1 justify-content-center">
                                <h6 className="mt-5 text-center txtColorWhite">Procédez au draft des maisons ...</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-4 d-flex justify-content-center">
                            <p>
                                {(etapeDraft == 2 || etapeDraft == 6 || etapeDraft == 7 || etapeDraft == 8) && 
                                <>
                                    {factionsForCurrentDraftKeyforgeJA?.map((current, index) => (
                                        <img key={`factionLogoA-${current.ID}`} src={current.LienImg} alt="Logo de la faction A du joueur 1" className={`borderRadius6 ${styles.logoFactionBig} ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} onClick={() => {setEtapeDraft(prev => prev +1); handleClickOnPickBanFaction(current.ID, current.LienImg);}}></img>
                                    ))}
                                </>}

                                {(etapeDraft == 1 || etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5) && 
                                <>
                                    {factionsForCurrentDraftKeyforgeJB?.map((current, index) => (
                                        <img key={`factionLogoB-${current.ID}`} src={current.LienImg} alt="Logo de la faction A du joueur 1" className={`borderRadius6 ${styles.logoFactionBig} ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} onClick={() => {setEtapeDraft(prev => prev +1); handleClickOnPickBanFaction(current.ID, current.LienImg);}}></img>
                                    ))}
                                </>}
                            </p>
                        </div>
                    </div>
                </>
                }
            </div>
            {etapeDraft >= 1 && etapeDraft < 9  &&
                <div className={styles.bandeauInstructionDraft}>
                    <div className="col-12 d-flex justify-content-center txt-base">
                        {true &&
                            <h5 className="text-center"><span className={`${txtCurrentPlayerColor}`}><b>{txtCurrentPlayer}</b></span>&nbsp;<span className={`${txtCurrentInstructionColor}`}>{txtCurrentInstruction}</span></h5>
                        }
                    </div>
                </div>
            }
            </>
        )
    };

    export default DraftKeyforge;