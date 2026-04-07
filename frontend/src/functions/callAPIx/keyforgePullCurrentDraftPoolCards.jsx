const pullCurrentDraftPoolCards = async (idDraft) => {
        try {
        const res = await fetch("/api/keyforge/recupPoolCartesPourDraft", {
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
        console.error('Erreur fetch pool de cartes du draft en cours :', err);
        }
    };

export default pullCurrentDraftPoolCards;
