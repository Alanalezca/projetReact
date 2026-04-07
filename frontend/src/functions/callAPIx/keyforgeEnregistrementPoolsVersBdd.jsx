const enregistrementPoolsVersBdd = async (payload, idDraft) => {

        try {
            const response = await fetch('/api/keyforge/enregistrementPoolsCartes', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({payload: payload, idDraft: idDraft})
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

export default enregistrementPoolsVersBdd;