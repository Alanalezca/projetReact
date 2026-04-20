    import {useState, useMemo, useEffect} from 'react';
    import styles from './draftKeyforgePartCardsSelection.module.css';
    import { useParams } from 'react-router-dom';
    import TCGCard from '../../components/others/TCGCard';
    import updateFocusSurFactionAouBouC from '../../functions/callAPIx/keyforgeUpdateFocusSurFactionAouBouC';
    import updateEtapeDraft from '../../functions/callAPIx/keyforgeUpdateEtapeDraft';
    import { hasCardsForFaction } from '../keyforge/draftKeyforgeLogic.js';
    import { useKeyforgeContext } from '../../../src/components/contexts/keyforgeContext';

    const DraftKeyforgePartCardsSelection = ({currentDraftKeyforge, setCurrentDraftKeyforge, draftEnCoursParJoueurAouB, setdraftEnCoursParJoueurAouB, draftEnCoursSurFactionAouBouC, setDraftEnCoursSurFactionAouBouC, setEtapeDraft}) => {
        const indiceFactionJoueurCourant = `${draftEnCoursSurFactionAouBouC}J${draftEnCoursParJoueurAouB + 1}`;
        const factionCourante = currentDraftKeyforge?.[0]?.[`FactionPick${indiceFactionJoueurCourant}`];
        const { poolCartesGlobal, setPoolCartesGlobal } = useKeyforgeContext();
        const { cartesValidees, setCartesValidees } = useKeyforgeContext();
        const [indexCarte, setIndexCarte] = useState(0);
        const [loaderCardisPicking, setLoaderCardIsPicking] = useState(false);

        const poolCartesGlobalWithFilters = useMemo(() => {
            if (!poolCartesGlobal) return [];

            return poolCartesGlobal.filter(
                current =>
                    current.IDFaction === factionCourante &&
                    current.JoueurAouB == draftEnCoursParJoueurAouB
            );
        }, [factionCourante, draftEnCoursParJoueurAouB, poolCartesGlobal]);

        const nbLegendairesCurrentFaction = useMemo(() => {
            if (!cartesValidees) {
                return 0;
            }

            return cartesValidees.filter(
                current =>
                    current.Rarete === "Légendaire" &&
                    current.IDFaction === factionCourante
                    && current.JoueurAouB == draftEnCoursParJoueurAouB
            ).length;
        }, [factionCourante, draftEnCoursParJoueurAouB, cartesValidees]);

        const nbCartesCurrentFactionPlayerDejaValidees   = useMemo(() => {
            if (!cartesValidees) return 0;

            return cartesValidees.filter(
                current =>
                    current.IDFaction === factionCourante &&
                    current.JoueurAouB == draftEnCoursParJoueurAouB
            ).length;
        }, [factionCourante, draftEnCoursParJoueurAouB, cartesValidees]);

        
        useEffect(() => {
                setIndexCarte(0);
        }, [factionCourante, draftEnCoursParJoueurAouB, poolCartesGlobal]);

        const retraitCartesTraitees = (indiceJoueur, indiceFaction) => {

            const poolCartesEpure = poolCartesGlobal?.filter(
                card => !(card.IDFaction === indiceFaction && card.JoueurAouB == indiceJoueur)
            );

            setPoolCartesGlobal(poolCartesEpure);
        };

        const factionsDraftHasCardsOrNot = useMemo(() => {
            if (!poolCartesGlobal) return null;

            const draft = currentDraftKeyforge[0];

            return {
                AJ1: hasCardsForFaction(poolCartesGlobal, draft.FactionPickAJ1, 0),
                BJ1: hasCardsForFaction(poolCartesGlobal, draft.FactionPickBJ1, 0),
                CJ1: hasCardsForFaction(poolCartesGlobal, draft.FactionPickCJ1, 0),
                AJ2: hasCardsForFaction(poolCartesGlobal, draft.FactionPickAJ2, 1),
                BJ2: hasCardsForFaction(poolCartesGlobal, draft.FactionPickBJ2, 1),
                CJ2: hasCardsForFaction(poolCartesGlobal, draft.FactionPickCJ2, 1)
            };
        }, [poolCartesGlobal]);

        const handleClicValiderCard = async (trinomeCards, carte) => {
            const isLastPickForCurrentFaction = indexCarte == (poolCartesGlobalWithFilters.length-3);
            const isLastPickForCurrentPlayer = ((factionsDraftHasCardsOrNot?.[`AJ${draftEnCoursParJoueurAouB +1}`] === true && isLastPickForCurrentFaction) 
                && (factionsDraftHasCardsOrNot?.[`BJ${draftEnCoursParJoueurAouB +1}`] === false)
                && (factionsDraftHasCardsOrNot?.[`CJ${draftEnCoursParJoueurAouB +1}`] === false))
                || ((factionsDraftHasCardsOrNot?.[`AJ${draftEnCoursParJoueurAouB +1}`] === false) 
                && (factionsDraftHasCardsOrNot?.[`BJ${draftEnCoursParJoueurAouB +1}`] === true && isLastPickForCurrentFaction)
                && (factionsDraftHasCardsOrNot?.[`CJ${draftEnCoursParJoueurAouB +1}`] === false))
                || ((factionsDraftHasCardsOrNot?.[`AJ${draftEnCoursParJoueurAouB +1}`] === false) 
                && (factionsDraftHasCardsOrNot?.[`BJ${draftEnCoursParJoueurAouB +1}`] === false)
                && (factionsDraftHasCardsOrNot?.[`CJ${draftEnCoursParJoueurAouB +1}`] === true && isLastPickForCurrentFaction))
            const closeDraftCurrentPlayer = isLastPickForCurrentPlayer;
            const draftJ1AlreadyFinished = factionsDraftHasCardsOrNot?.[`AJ1`] === false && factionsDraftHasCardsOrNot?.[`BJ1`] === false && factionsDraftHasCardsOrNot?.[`CJ1`] === false;
            const draftJ2AlreadyFinished = factionsDraftHasCardsOrNot?.[`AJ2`] === false && factionsDraftHasCardsOrNot?.[`BJ2`] === false && factionsDraftHasCardsOrNot?.[`CJ2`] === false;
            const updateEtapeSiDraftJ1J2Finished = isLastPickForCurrentPlayer === true && draftJ1AlreadyFinished === true || isLastPickForCurrentPlayer === true && draftJ2AlreadyFinished === true ? 12 : null;

            setLoaderCardIsPicking(true);

            try {
                const res = await fetch(`/api/keyforge/enregistrementCarteValidee`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            parIDDraft: carte.IDDraftSession,
                            parIDCard: carte.IDCarte,
                            parJAorB: carte.JoueurAouB,
                            Classement: trinomeCards[0].Classement,
                            ClassementCardToDeleteA: trinomeCards[1].Classement,
                            ClassementCardToDeleteB: trinomeCards[2].Classement,
                            reinitFocusFactionDuDraft: isLastPickForCurrentFaction,
                            reinitFocusJoueurDuDraft: isLastPickForCurrentPlayer,
                            draftJ1Finished: draftJ1AlreadyFinished === true ? true : draftEnCoursParJoueurAouB === 0 && closeDraftCurrentPlayer,
                            draftJ2Finished: draftJ2AlreadyFinished === true ? true : draftEnCoursParJoueurAouB === 1 && closeDraftCurrentPlayer,
                            etape: updateEtapeSiDraftJ1J2Finished
                        }),
                    });

                    if (!res.ok) {
                        throw new Error(`Erreur HTTP: ${res.status}`);
                    }

                    if(indexCarte < (poolCartesGlobalWithFilters.length-3)) {
                        setIndexCarte(prev => prev + 3);
                    } else {
                        setIndexCarte(0);
                        setDraftEnCoursSurFactionAouBouC(null);
                        if(isLastPickForCurrentPlayer) {
                            setdraftEnCoursParJoueurAouB(null);
                            setCurrentDraftKeyforge(prev => [{...prev[0], [`DraftJ${draftEnCoursParJoueurAouB + 1}Finished`] : true}]);
                        }
                        retraitCartesTraitees(draftEnCoursParJoueurAouB, factionCourante);
                    }
                    setCartesValidees(prev => [...prev, carte]);
                    
                    if(updateEtapeSiDraftJ1J2Finished === 12) {
                        setCurrentDraftKeyforge(prev => [{...prev[0], Etat: 12}]);
                        setEtapeDraft(updateEtapeSiDraftJ1J2Finished);
                    }

                    const data = await res.json();
                    return data;

                } catch (err) {
                    console.error('Erreur chargement carte:', err);
                    return null;
                }
                 finally {
                    setLoaderCardIsPicking(false);
                }
        }

        const currentTrinomeCards = poolCartesGlobalWithFilters?.slice(indexCarte, indexCarte + 3);

        return (
                <>
                    <div className="row mb-4">
                        <div className="col-12 mt-2 d-flex justify-content-center">
                            <h4 className="text-center txtColorWhite">Choix des cartes</h4>
                        </div>
                    </div>
                    <div className="row">             
                        <div className="col-12 mt-1 justify-content-center">
                                <h6 className=" text-center txtColorWhite">Focus sur la maison ...</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-2 d-flex justify-content-center">
                            {currentDraftKeyforge.map((current, index) => (
                                <p key={current.ID}>
                                    <img src={draftEnCoursParJoueurAouB === 1 ? current.LienImgAJ2 : current.LienImgAJ1} 
                                        alt="Logo de la faction A" 
                                        className={`borderRadius6 ${styles.logoFactionBig} ${draftEnCoursSurFactionAouBouC === "A" && "backgroundAnimFocus"} ${factionsDraftHasCardsOrNot?.[`AJ${draftEnCoursParJoueurAouB +1}`] === false  ? "backgroundGreen" : "backgroundAnimSurvol"}`} 
                                        onClick={() => {
                                            if(!draftEnCoursSurFactionAouBouC && factionsDraftHasCardsOrNot?.[`AJ${draftEnCoursParJoueurAouB +1}`] === true) 
                                                {setDraftEnCoursSurFactionAouBouC("A"); 
                                                    updateFocusSurFactionAouBouC(current.ID, "A"); 
                                                    setCurrentDraftKeyforge(prev => [{...prev[0], DraftEnCoursSurFactionAouBouC: "A"}]);
                                            }}}>
                                    </img>
                                    <img src={draftEnCoursParJoueurAouB === 1 ? current.LienImgBJ2 : current.LienImgBJ1} 
                                        alt="Logo de la faction B" 
                                        className={`borderRadius6 ms-4 ${styles.logoFactionBig} ${draftEnCoursSurFactionAouBouC === "B" && "backgroundAnimFocus"} ${factionsDraftHasCardsOrNot?.[`BJ${draftEnCoursParJoueurAouB +1}`] === false  ? "backgroundGreen" : "backgroundAnimSurvol"}`}  
                                        onClick={() => {
                                            if(!draftEnCoursSurFactionAouBouC && factionsDraftHasCardsOrNot?.[`BJ${draftEnCoursParJoueurAouB +1}`] === true) 
                                                {setDraftEnCoursSurFactionAouBouC("B"); 
                                                    updateFocusSurFactionAouBouC(current.ID, "B"); 
                                                    setCurrentDraftKeyforge(prev => [{...prev[0], DraftEnCoursSurFactionAouBouC: "B"}]);
                                            }}}>
                                    </img>
                                    <img src={draftEnCoursParJoueurAouB === 1 ? current.LienImgCJ2 : current.LienImgCJ1} 
                                        alt="Logo de la faction C" 
                                        className={`borderRadius6 ms-4 ${styles.logoFactionBig} ${draftEnCoursSurFactionAouBouC === "C" && "backgroundAnimFocus"} ${factionsDraftHasCardsOrNot?.[`CJ${draftEnCoursParJoueurAouB +1}`] === false  ? "backgroundGreen" : "backgroundAnimSurvol"}`}  
                                        onClick={() => {
                                        if(!draftEnCoursSurFactionAouBouC && factionsDraftHasCardsOrNot?.[`CJ${draftEnCoursParJoueurAouB +1}`] === true) 
                                            {setDraftEnCoursSurFactionAouBouC("C"); 
                                                updateFocusSurFactionAouBouC(current.ID, "C"); 
                                                setCurrentDraftKeyforge(prev => [{...prev[0], DraftEnCoursSurFactionAouBouC: "C"}]);
                                        }}}>
                                    </img>
                                </p>
                            ))}
                        </div>
                    </div>
                    {draftEnCoursSurFactionAouBouC && 
                        <div className="row">             
                            <div className="col-12 mt-3 mb-3 text-center">
                                    <h6>
                                        <span className="txtColorWhite">Cartes validées : {nbCartesCurrentFactionPlayerDejaValidees} / 12 </span>
                                        <span className="txtColorDarkBisLight">(dont </span>
                                        <span className="txtColorB">{nbLegendairesCurrentFaction}</span>
                                        <span className="txtColorDarkBisLight"> légendaires)</span>
                                    </h6>
                            </div>
                        </div>
                    }
                    <div className="row">    
                        {poolCartesGlobalWithFilters?.slice(indexCarte, indexCarte + 3)?.map((current, index) => (
                            <div className={`col-4 d-flex justify-content-center`} key={current.IDCarte + current.Classement}>
                                <TCGCard 
                                nomCarte={current.NomCarte} 
                                idDraft={current.IDDraftSession} 
                                idCarte={current.IDCarte} 
                                classement={current.Classement} 
                                parJAorB={current.JoueurAouB} 
                                imageCarte={current.CheminImgCarte} 
                                rareteCarte={current.Rarete} 
                                handleClicValiderCarte={() => {!loaderCardisPicking && handleClicValiderCard(currentTrinomeCards, current)}} 
                                isLoading={loaderCardisPicking}/>
                            </div>
                        ))}
                    </div>
                </>
        )
    };

    export default DraftKeyforgePartCardsSelection;
