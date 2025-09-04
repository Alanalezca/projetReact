export const handleDeleteArticle = async (codeArticle, titreArticle, showAlerte, setRefresher) => {

    try {
        const response = await fetch("/api/articles/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ parCodeArticle: codeArticle})
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
        }

        const result = await response.json();
        showAlerte('success', '(Suppression article)', '', `L'article "` + titreArticle + `" a bien été supprimé.`);
        setRefresher(prevForceRefresh => prevForceRefresh + 1);
    } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
    }
    };