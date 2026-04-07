

const recupKeyforgeTxtCurrentInstruction = (etapeDraft, currentDraftKeyforge) => {
    const result = {txtPlayer: "", colorPlayer: "", txtInstruction: "", colorInstruction: ""};
    const draft = currentDraftKeyforge?.[0];
        if (etapeDraft == 1) {
            result.colorInstruction = "txtClignoteRed";
            result.colorPlayer = "txtColorPlayerRed";
            result.txtPlayer = draft.PseudoJ1;
            result.txtInstruction = "doit bannir une maison";
        } else if (etapeDraft == 2) {
            result.colorInstruction = "txtClignoteRed";
            result.colorPlayer = "txtColorPlayerBlue";
            result.txtPlayer = draft.PseudoJ2;
            result.txtInstruction = "doit bannir une maison";
        } else if (etapeDraft == 3) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerBlue";
            result.txtPlayer = draft.PseudoJ2;
            result.txtInstruction = "doit choisir sa première maison";
        } else if (etapeDraft == 4) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerBlue";
            result.txtPlayer = draft.PseudoJ2;
            result.txtInstruction = "doit choisir sa seconde maison";
        } else if (etapeDraft == 5) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerBlue";
            result.txtPlayer = draft.PseudoJ2;
            result.txtInstruction = "doit choisir sa dernière maison";
        } else if (etapeDraft == 6) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerRed";
            result.txtPlayer = draft.PseudoJ1;
            result.txtInstruction = "doit choisir sa première maison";
        } else if (etapeDraft == 7) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerRed";
            result.txtPlayer = draft.PseudoJ1;
            result.txtInstruction = "doit choisir sa seconde maison";
        } else if (etapeDraft == 8) {
            result.colorInstruction = "txtClignoteGreen";
            result.colorPlayer = "txtColorPlayerRed";
            result.txtPlayer = draft.PseudoJ1;
            result.txtInstruction = "doit choisir sa dernière maison";
        }
    return result;
};

export default recupKeyforgeTxtCurrentInstruction;