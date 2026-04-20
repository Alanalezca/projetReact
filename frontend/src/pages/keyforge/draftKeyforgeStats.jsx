    import styles from './draftKeyforgeStats.module.css';
    import { useMemo } from 'react';
    import { useKeyforgeContext } from '../../../src/components/contexts/keyforgeContext';
    import ChartJSBar from '../../components/others/charts/ChartJSBar';
    import DraftKeyforgeStatsResume from '../../pages/keyforge/draftKeyforgeStatsResume';
    
    const DraftKeyforgeStats = ({ currentDraft, focusSurJoueurAouBPhaseSelection, focusSurJoueurAouBforStatsPostSelection }) => {

        const { cartesValidees, setCartesValidees } = useKeyforgeContext();
        
        const labels = useMemo(() => {
            if (!currentDraft) return [];
            const factionsUniques = [currentDraft[0]?.[`LibelleFactionAJ${focusSurJoueurAouBPhaseSelection +1}`], currentDraft[0]?.[`LibelleFactionBJ${focusSurJoueurAouBPhaseSelection +1}`], currentDraft[0]?.[`LibelleFactionCJ${focusSurJoueurAouBPhaseSelection +1}`]];
            return factionsUniques;
        
        }, [cartesValidees, focusSurJoueurAouBPhaseSelection, currentDraft]);

        const values = useMemo(() => {

            if (!currentDraft) return [];
            const valueFactionA = cartesValidees.filter(item => item.IDFaction === currentDraft[0]?.[`FactionPickAJ${focusSurJoueurAouBPhaseSelection +1}`] && item.JoueurAouB == focusSurJoueurAouBPhaseSelection).length;
            const valueFactionB = cartesValidees.filter(item => item.IDFaction === currentDraft[0]?.[`FactionPickBJ${focusSurJoueurAouBPhaseSelection +1}`] && item.JoueurAouB == focusSurJoueurAouBPhaseSelection).length;
            const valueFactionC = cartesValidees.filter(item => item.IDFaction === currentDraft[0]?.[`FactionPickCJ${focusSurJoueurAouBPhaseSelection +1}`] && item.JoueurAouB == focusSurJoueurAouBPhaseSelection).length;
            return [valueFactionA, valueFactionB, valueFactionC];
        
        }, [cartesValidees, focusSurJoueurAouBPhaseSelection, currentDraft]);


        const colors = useMemo(() => {

        if (!currentDraft) return [];
            const colorFactionA = 'rgba(' + currentDraft[0]?.[`CouleurAJ${focusSurJoueurAouBPhaseSelection +1}`] + ',0.6';
            const colorFactionB = 'rgba(' + currentDraft[0]?.[`CouleurBJ${focusSurJoueurAouBPhaseSelection +1}`] + ',0.6';
            const colorFactionC = 'rgba(' + currentDraft[0]?.[`CouleurCJ${focusSurJoueurAouBPhaseSelection +1}`] + ',0.6';
            return [colorFactionA, colorFactionB, colorFactionC];
        }, [cartesValidees, focusSurJoueurAouBPhaseSelection, currentDraft]);

        const nbLegendairesJoueurAetB = useMemo(() => {

            if (!currentDraft) return [0, 0];
            const NbLegendaireA = cartesValidees.filter(item => item.Rarete === "Légendaire" && item.JoueurAouB == 0).length;
            const NbLegendaireB = cartesValidees.filter(item => item.Rarete === "Légendaire" && item.JoueurAouB == 1).length;
            return [NbLegendaireA, NbLegendaireB];
        }, [cartesValidees]);

        console.log(labels, values, colors, cartesValidees, currentDraft[0], focusSurJoueurAouBPhaseSelection, focusSurJoueurAouBforStatsPostSelection);
        return (
            <>
                {currentDraft[0]?.Etat >= 10 && currentDraft[0]?.Etat < 12 &&
                    <ChartJSBar labels={labels} values={values} colors={colors} />
                }
                {currentDraft[0]?.Etat >= 12 &&
                <div className="d-flex justify-content-center align-items-center h-100">
                    <DraftKeyforgeStatsResume nbLegendaires={nbLegendairesJoueurAetB} pseudoJ1={currentDraft[0]?.PseudoJ1} pseudoJ2={currentDraft[0]?.PseudoJ2}/> 
                </div>
                }
            </>
        );
    };

    export default DraftKeyforgeStats;

