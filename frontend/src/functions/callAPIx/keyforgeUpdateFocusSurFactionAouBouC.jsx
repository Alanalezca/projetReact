    const updateFocusSurFactionAouBouC = async (idCurrentDraft, indiceFactionFocusAouBouC) => {
        try {
            const response = await fetch('/api/keyforge/updateFocusSurFactionAouBouC', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({parID: idCurrentDraft, parFactionAorBorC: indiceFactionFocusAouBouC})
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

    export default updateFocusSurFactionAouBouC;