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
    const [draftNotExist, setDraftNotExist] = useState(null);
    const [forceRefresh, setForceRefresh] = useState(0);
    const [showModalNewDraftKeyforge, setShowModalNewDraftKeyforge] = useState(false);
    const [etapeDraft, setEtapeDraft] = useState(0);
    const [txtCurrentInstruction, setTxtCurrentInstruction] = useState("XXX");
    const [txtCurrentInstructionColor, setTxtCurrentInstructionColor] = useState("txtClignoteRed");
    const [txtCurrentPlayer, setTxtCurrentPlayer] = useState("XXX");
    const [txtCurrentPlayerColor, setTxtCurrentPlayerColor] = useState("XXX");
    const [phasePickOrBan, setPhasePickOrBan] = useState("");
    const [factionsPickBanByPlayer, setFactionsPickBanByPlayer] = useState([]);

useEffect(() => {
    if(currentDraftKeyforge) {
        if (etapeDraft == 1) {
            setPhasePickOrBan("Ban");
            setTxtCurrentPlayer(currentDraftKeyforge[0].PseudoJ1);
            setTxtCurrentInstruction("doit bannir une maison");
        } else if (etapeDraft == 2) {
            setTxtCurrentPlayer(currentDraftKeyforge[0].PseudoJ2);
            setTxtCurrentInstruction("doit bannir une maison");
        } else if (etapeDraft == 3) {
            setPhasePickOrBan("Pick");
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
        console.log('test', data);
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
}, [slug, forceRefresh]);

useEffect(() => {
    setIsLoading(true);
    fetch(`/api/keyforge/factionsFromSet?setId=A1`)
    .then(response => response.json())
    .then(data => {
        setfactionsForCurrentDraftKeyforgeJA(data);
        setfactionsForCurrentDraftKeyforgeJB(data);
        console.log('factions', data);
        setIsLoading(false);
    }).catch(error => console.error('Erreur fetch keyforge liste factions :', error));
}, [currentDraftKeyforge]);

useEffect(() => {
        if (Object.keys(factionsPickBanByPlayer).length == 8)
            {
                console.log('A', factionsForCurrentDraftKeyforgeJA);
                console.log('B', factionsForCurrentDraftKeyforgeJB);
            };
}, [factionsPickBanByPlayer])

const handleClickOnPickBanFaction = (idFaction) => {
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
    } else if (etapeDraft == 2) 
    {
        setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
        prevListeFactions?.map(prevFaction =>
        prevFaction.ID === idFaction
        ? {...prevFaction,
            Banned: !prevFaction.Banned}
        : prevFaction
    ))
    } else if (etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5) 
    {
        setfactionsForCurrentDraftKeyforgeJB(prevListeFactions => 
        prevListeFactions?.map(prevFaction =>
        prevFaction.ID === idFaction
        ? {...prevFaction,
            Picked: !prevFaction.Picked}
        : prevFaction
    ))
    } else if (etapeDraft == 6 || etapeDraft == 7 || etapeDraft == 8) 
    {
        setfactionsForCurrentDraftKeyforgeJA(prevListeFactions => 
        prevListeFactions?.map(prevFaction =>
        prevFaction.ID === idFaction
        ? {...prevFaction,
            Picked: !prevFaction.Picked}
        : prevFaction
    ))
    }
};  

return (
        <>
        <div className="container-xl mt-3">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="mt-4 text-center txtColorWhite">Draft KeyForge</h2>
                </div>
            </div>
            <div className={styles.EnteteDraft}>
                <div className="col-12 mt-2 d-flex justify-content-center">
                    <h4 className="text-center txtColorWhite">Mon draft en cours</h4>
                </div>
                {isLoading ?
                        <Loader/> : <>
                {currentDraftKeyforge?.map((current, index) => (
                <div className="row">
                    <div className="col-2 mt-2">
                        <div className="col-12 mt-3 ps-4">
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
                        <div className="col-12 mt-3">
                            <p className="txtColorWhite">{new Date(current.DateCreation).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="col-12">
                            <p className="txtColorWhite">{new Date(current.DateDerModif).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="col-12">
                            <p className="txtColorWhite">{current.PseudoJ1}</p>
                        </div>
                            <p>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction A du joueur 1" className={styles.logoFaction}></img>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction B du joueur 1" className={styles.logoFaction}></img>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction C du joueur 1" className={styles.logoFaction}></img>
                            </p>
                        <div className="col-12">
                            <p className="txtColorWhite">{current.PseudoJ2}</p>
                        </div>
                        <div className="col-12">
                            <p>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction A du joueur 1" className={styles.logoFaction}></img>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction B du joueur 1" className={styles.logoFaction}></img>
                                <img src="\images\keyforge\NC.png" alt="Logo de la faction C du joueur 1" className={styles.logoFaction}></img>
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
            {modeDraftFaction && etapeDraft < 10 && 
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
                                    <img key={`factionLogo-${index}`} src={current.LienImg} alt="Logo de la faction A du joueur 1" className={`borderRadius6 ${styles.logoFactionBig} ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} onClick={() => {setEtapeDraft(prev => prev +1); handleClickOnPickBanFaction(current.ID);}}></img>
                                ))}
                            </>}

                            {(etapeDraft == 1 || etapeDraft == 3 || etapeDraft == 4 || etapeDraft == 5) && 
                            <>
                                {factionsForCurrentDraftKeyforgeJB?.map((current, index) => (
                                    <img key={`factionLogo-${index}`} src={current.LienImg} alt="Logo de la faction A du joueur 1" className={`borderRadius6 ${styles.logoFactionBig} ${current.Picked ? "backgroundAnimGreenSmooth" : current.Banned && "backgroundAnimRed"}`} onClick={() => {setEtapeDraft(prev => prev +1); handleClickOnPickBanFaction(current.ID);}}></img>
                                ))}
                            </>}
                        </p>
                    </div>
                </div>
            </>
            }
        </div>
        {true &&
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