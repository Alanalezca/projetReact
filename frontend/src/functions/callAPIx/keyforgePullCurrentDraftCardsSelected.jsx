const pullCurrentDraftCardsSelected = async (idDraft) => {
        try {
        const res = await fetch("/api/keyforge/recupPoolCartesValideesDuDraftEnCours", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({idDraft: idDraft})
        });
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        return data;
        } catch (err) {
        console.error('Erreur fetch liste de cartes validées pour le draft en cours :', err);
        }
    };

export default pullCurrentDraftCardsSelected;
