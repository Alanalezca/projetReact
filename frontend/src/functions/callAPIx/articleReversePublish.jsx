    export const handleReversePublished = async (codeArticle, titreArticle, articlePublieOuiNon, showAlerte, setRefresher) => {

    try {
        const response = await fetch("/api/articles/reverseCurrentShow", {
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
        showAlerte('success', '(Publication article)', '', `L'article "` + titreArticle + `" a bien été ${articlePublieOuiNon == true ? "dépublié." : "publié."}`);
        setRefresher?.(prevForceRefresh => prevForceRefresh + 1);
    } catch (err) {
        console.error("Erreur lors de l'update du publish de l'article :", err);
    }
    };