   
    const updateFocusSurJoueurAouB = async (idCurrentDraft, indiceJoueurAouB) => {
        console.log('test');
        const response = await fetch('/api/keyforge/updateFocusSurJoueurAouB', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                parID: idCurrentDraft,
                parJoueurAorB: indiceJoueurAouB
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Erreur serveur");
        }

        return response.json();
    };

    export default updateFocusSurJoueurAouB;