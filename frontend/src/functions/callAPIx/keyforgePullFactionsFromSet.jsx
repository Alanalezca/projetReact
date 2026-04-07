const pullCurrentFactionsFromSet = async (idSet) => {
    let currentFactions = null;
        if (idSet) {
            try {

                const response = await fetch(`/api/keyforge/factionsFromSet?setId=` + idSet);
                const data = await response.json();

                currentFactions = data;

            } catch (error) {
                console.error('Erreur fetch keyforge liste factions :', error);
            }
        }
        return currentFactions;
    };

export default pullCurrentFactionsFromSet;