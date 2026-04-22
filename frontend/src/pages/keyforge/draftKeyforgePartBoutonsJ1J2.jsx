
import { useKeyforgeContext } from '../../../src/components/contexts/keyforgeContext';
import { Button } from 'react-bootstrap';
import updateFocusSurJoueurAouB from '../../../src/functions/callAPIx/keyforgeUpdateFocusSurJoueurAouB';
import updateEtapeDraft from '../../../src/functions/callAPIx/keyforgeUpdateEtapeDraft';


const DraftKeyforgePartBoutonsJ1J2 = ({currentDraft, setCurrentDraft, draftTermine, focusAouBforStats, setfocusAouBforStats}) => {
    const {
        setDraftEnCoursParJoueurAouB, 
        draftEnCoursParJoueurAouB
    } = useKeyforgeContext();

    const styleBoutonJoueur = ({
        isDraftFinished,
        joueurFini,
        focusGlobal,
        joueurIndex,
        focusStats
    }) => {
        if (isDraftFinished) {
            return focusStats === joueurIndex
            ? "btn-ColorFFocused"
            : "btn-ColorF";
        }

        if (joueurFini) return "btn-ColorFinished";

        if (focusGlobal !== null && focusGlobal !== joueurIndex)
            return "btn-ColorInactif";

        if (focusGlobal === joueurIndex)
            return "btn-ColorFFocused";

        return "btn-ColorF";
    };
    

    const handleClickBoutonJoueur = async ({
        isDraftFinished,
        joueurFini,
        joueurIndex
    }) => {
        if (!isDraftFinished) {

            if (joueurFini) return;

            try {
                await updateFocusSurJoueurAouB(currentDraft.ID, joueurIndex);
                await updateEtapeDraft(currentDraft.ID, 10);

                setCurrentDraft(prev => [{
                    ...prev[0],
                    DraftEnCoursPourJoueurAouB: joueurIndex,
                    Etat: 11
                }]);

                setDraftEnCoursParJoueurAouB(joueurIndex);

            } catch (e) {
                console.error(e);
            }

        } else {
            setfocusAouBforStats(joueurIndex);
        }
    };

    const getButtonLabel = (pseudo) => {
        return !draftTermine
            ? `Commencer le draft de ${pseudo}`
            : `Voir les statistiques de ${pseudo}`;
    };

    return (
            <div className="row mb-4">
                <div className="col-6 mt-4 mb-4 d-flex justify-content-center">
                    <Button 
                        className={`btn btn-primary 
                            ${styleBoutonJoueur({
                                isDraftFinished: draftTermine,
                                joueurFini: currentDraft.DraftJ1Finished,
                                focusGlobal: draftEnCoursParJoueurAouB,
                                joueurIndex: 0,
                                focusStats: focusAouBforStats
                                })} 
                            btn-lg`} 
                        disabled={draftEnCoursParJoueurAouB == 1} 
                        onClick={() =>
                            handleClickBoutonJoueur({
                                isDraftFinished: draftTermine,
                                joueurFini: currentDraft.DraftJ1Finished,
                                joueurIndex: 0
                            })
                        }  
                    >
                        {getButtonLabel(currentDraft?.PseudoJ1)}
                    </Button>
                </div>
                <div className="col-6 mt-4 mb-4 d-flex justify-content-center">
                    <Button 
                        className={`btn btn-primary 
                            ${styleBoutonJoueur({
                                isDraftFinished: draftTermine,
                                joueurFini: currentDraft.DraftJ2Finished,
                                focusGlobal: draftEnCoursParJoueurAouB,
                                joueurIndex: 1,
                                focusStats: focusAouBforStats
                                })} 
                            btn-lg`} 
                        disabled={draftEnCoursParJoueurAouB == 0} 
                        onClick={() =>
                            handleClickBoutonJoueur({
                                isDraftFinished: draftTermine,
                                joueurFini: currentDraft.DraftJ2Finished,
                                joueurIndex: 1
                            })
                        }
                    >
                        {getButtonLabel(currentDraft?.PseudoJ2)}
                    </Button>
                </div>
            </div>
        )
    };

export default DraftKeyforgePartBoutonsJ1J2;