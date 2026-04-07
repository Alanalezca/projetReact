    const updateEtapeDraft = async (idCurrentDraft, numEtape) => {
        const newValEtape = numEtape+1;
        try {
            const response = await fetch('/api/keyforge/updateEtapeDraft', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({parID: idCurrentDraft, parEtape: newValEtape})
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Erreur backend :", text);
                throw new Error("Erreur serveur");
            }

            return await response.json();

        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    export default updateEtapeDraft;