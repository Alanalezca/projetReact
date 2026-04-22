import { useState } from 'react';

const draftStepsConfig = {
    1: { type: "Banned", player: "J2", cleSetter: "FactionBanJ2" },
    2: { type: "Banned", player: "J1", cleSetter: "FactionBanJ1" },
    3: { type: "Picked", player: "J2", slot: "A", cleSetter: "FactionPickAJ2", cleSetterBisA: "LienImgAJ2", cleSetterBisB: "LibelleFactionAJ2", cleSetterBisC: "CouleurAJ2" },
    4: { type: "Picked", player: "J2", slot: "B", cleSetter: "FactionPickBJ2", cleSetterBisA: "LienImgBJ2", cleSetterBisB: "LibelleFactionBJ2", cleSetterBisC: "CouleurBJ2" },
    5: { type: "Picked", player: "J2", slot: "C", cleSetter: "FactionPickCJ2", cleSetterBisA: "LienImgCJ2", cleSetterBisB: "LibelleFactionCJ2", cleSetterBisC: "CouleurCJ2" },
    6: { type: "Picked", player: "J1", slot: "A", cleSetter: "FactionPickAJ1", cleSetterBisA: "LienImgAJ1", cleSetterBisB: "LibelleFactionAJ1", cleSetterBisC: "CouleurAJ1" },
    7: { type: "Picked", player: "J1", slot: "B", cleSetter: "FactionPickBJ1", cleSetterBisA: "LienImgBJ1", cleSetterBisB: "LibelleFactionBJ1", cleSetterBisC: "CouleurBJ1" },
};

export const useDraftFactions = ({
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
}) => {

    const step = draftStepsConfig[etapeDraft];

    const factionSetters = {
        J1: setFactionsJA,
        J2: setFactionsJB
    };

    const [factionsPickBan, setFactionPickBan] = useState({
        FactionBanJ1: "", 
        FactionPickAJ1: "", 
        FactionPickBJ1: "", 
        FactionPickCJ1: "", 
        FactionBanJ2: "", 
        FactionPickAJ2: "", 
        FactionPickBJ2: "", 
        FactionPickCJ2: ""
    });

    const handleClickOnPickBanFaction = (id, img, name, color) => {

        if (etapeDraft < 8) {
            factionSetters[step.player](prev =>
                prev?.map(f =>
                    f.ID === id
                        ? { ...f, [step.type]: !f[step.type] }
                        : f
                )
            );

            setFactionPickBan(prev => ({
                ...prev,
                ...(step.cleSetter && { [step.cleSetter]: id }),
                ...(step.cleSetterBisA && { [step.cleSetterBisA]: img }),
                ...(step.cleSetterBisB && { [step.cleSetterBisB]: name }),
                ...(step.cleSetterBisC && { [step.cleSetterBisC]: color })
            }));

        } else if (etapeDraft === 8) {
            processPicksBansFactions(id, img, name, color);
        }

        setEtapeDraft(prev => prev + 1);
    };

    const processPicksBansFactions = async (id, img, name, color) => {
        try {
            const data = {
                ...factionsPickBan,
                FactionPickCJ1: id,
                LienImgCJ1: img,
                LibelleFactionCJ1: name,
                CouleurCJ1: color
            };

            await updateFactionsCurrentDraft(currentDraftKeyforge[0].ID, ...Object.values(data));

            setFactionsJA(prev =>
                prev?.map(f =>
                    f.ID === id ? { ...f, Picked: !f.Picked } : f
                )
            );

            setFactionPickBan(data);
            setCurrentDraftKeyforge(prev => [{
                ...prev[0],
                ...data,
                Etat: 10
            }]);

        } catch (e) {
            console.error(e);
            setError("Erreur lors de la mise à jour");
        }
    };

    return {
        handleClickOnPickBanFaction,
        factionsJA,
        factionsJB,
        setFactionsJA,
        setFactionsJB
    };
};