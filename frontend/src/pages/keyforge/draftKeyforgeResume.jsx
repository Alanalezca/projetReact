    import styles from './draftKeyforgeResume.module.css';
    import DraftKeyforgeStats from '../../pages/keyforge/draftKeyforgeStats';
    import { useKeyforgeContext } from '../../../src/components/contexts/keyforgeContext';
    import { useMemo } from 'react';
    import { Button } from 'react-bootstrap';

    const DraftKeyforgeResume = ({ currentDraftKeyforge, focusSurJoueurAouBforStats, focusSurStat }) => {
        const {draftEnCoursParJoueurAouB, setDraftEnCoursParJoueurAouB} = useKeyforgeContext(null);
        const {draftEnCoursSurFactionAouBouC, setDraftEnCoursSurFactionAouBouC} = useKeyforgeContext(null);

        const currentEtape = useMemo(() => {
            return currentDraftKeyforge?.[0].Etat;
        }, [currentDraftKeyforge]);

        const etatLibelleEtClass = {
        0: { etatLibelle: "Maisons à pick/ban", etatClass: "txtColorYellow" },
        10: { etatLibelle: "Draft prêt", etatClass: "txtColorGreen" },
        11: { etatLibelle: "Draft en cours", etatClass: "txtColorYellow" },
        12: { etatLibelle: "Draft terminé", etatClass: "txtColorGreen" },
        };

        const { etatLibelle, etatClass } = etatLibelleEtClass[currentEtape] || {
        label: "NC",
        className: "",
        };

        const draftEnCours = currentEtape >= 10;
        const draftCardsFinish = currentEtape >= 12;
        const titre = currentDraftKeyforge?.[0]?.Titre ?? "---";

        const getFactionImg = (img) =>
            img || "/images/keyforge/NC.png";

        const currentDraft = currentDraftKeyforge?.[0];
        
        const factionsJ1 = {
        A: getFactionImg(currentDraft?.LienImgAJ1),
        B: getFactionImg(currentDraft?.LienImgBJ1),
        C: getFactionImg(currentDraft?.LienImgCJ1),
        };

        const factionsJ2 = {
        A: getFactionImg(currentDraft?.LienImgAJ2),
        B: getFactionImg(currentDraft?.LienImgBJ2),
        C: getFactionImg(currentDraft?.LienImgCJ2),
        };

        const showStats = currentEtape >= 10;
        
        return (
            <div className={`mb-4 ${styles.EnteteDraft}`}>
                <div className="col-12 d-flex justify-content-center">
                    <h4 className="text-center txtColorWhite">{titre}</h4>
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
                                <p className="txtColorPlayerRed">{current.PseudoJ1}</p>
                            </div>
                                <p>
                                    <img 
                                        src={factionsJ1.A} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={factionsJ1.B} 
                                        alt="Logo de la faction B du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={factionsJ1.C} 
                                        alt="Logo de la faction C du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                </p>
                            <div className="col-12">
                                <p className="txtColorPlayerBlue">{current.PseudoJ2}</p>
                            </div>
                            <div className="col-12">
                                <p>
                                    <img 
                                        src={factionsJ2.A} 
                                        alt="Logo de la faction A du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={factionsJ2.B} 
                                        alt="Logo de la faction B du joueur 1" 
                                        className={styles.logoFaction}
                                    />
                                    <img 
                                        src={factionsJ2.C} 
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
                                <p className={etatClass}>{etatLibelle}</p>
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
                    <div className="col-6 mt-2 borderLeft1pxColE">
                        {showStats &&
                            <DraftKeyforgeStats 
                                currentDraft={currentDraftKeyforge} 
                                focusSurJoueurAouBPhaseSelection={draftEnCoursParJoueurAouB} 
                                focusSurJoueurAouBforStatsPostSelection={focusSurJoueurAouBforStats}
                            />
                        }
                    </div>
                    {draftEnCours &&
                    <div className="col-2 mt-2">
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            {draftCardsFinish ? "Pénalités" : "Avancée"}
                        </Button>
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            Répartition générale
                        </Button>
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            Répartition par faction
                        </Button>
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            Présence / puissance
                        </Button>
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            Aombre généré
                        </Button>
                        <Button className={`btn btn-primary btn-ColorF w-100 mb-2`}>
                            Raretés
                        </Button>
                    </div>
                    }
                </div>
            </div>
        )
    };

    export default DraftKeyforgeResume;