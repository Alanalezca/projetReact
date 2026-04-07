import getRandomisationArray from '../../functions/getRandomisationArray';
import getRandomUniqueNumbers from '../../functions/getRandomUniqueNumbers';
import enregistrementPoolsVersBdd from '../callAPIx/keyforgeEnregistrementPoolsVersBdd.jsx'
import pullCurrentDraftPoolCards from '../callAPIx/keyforgePullCurrentDraftPoolCards.jsx'


const creationPoolCartes = async (currentDraftKeyforge, setIsLoading) => {
        try {

            const response = await fetch(
                `/api/keyforge/basePoolCartes?factions=${
                    currentDraftKeyforge?.[0]?.FactionPickAJ1
                },${
                    currentDraftKeyforge?.[0]?.FactionPickBJ1
                },${
                    currentDraftKeyforge?.[0]?.FactionPickCJ1
                },${
                    currentDraftKeyforge?.[0]?.FactionPickAJ2
                },${
                    currentDraftKeyforge?.[0]?.FactionPickBJ2
                },${
                    currentDraftKeyforge?.[0]?.FactionPickCJ2
                }`
            );


            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status} : ${errText}`);
            }

            const data = await response.json();

            const poolCartesAJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickAJ1);
            const poolCartesBJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickBJ1);
            const poolCartesCJ1 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickCJ1);
            const poolCartesAJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickAJ2);
            const poolCartesBJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickBJ2);
            const poolCartesCJ2 = splitCardsByFaction(data, currentDraftKeyforge?.[0]?.FactionPickCJ2);
            let poolCartesAJ1Final = [];
            let poolCartesBJ1Final = [];
            let poolCartesCJ1Final = [];
            let poolCartesAJ2Final = [];
            let poolCartesBJ2Final = [];
            let poolCartesCJ2Final = [];
            /* Génération des pools de cartes pour chargement bdd */
            switch (currentDraftKeyforge?.[0]?.FactionPickAJ1) {
                case currentDraftKeyforge?.[0]?.FactionPickAJ2:
                    poolCartesAJ1Final = generationPoolCartesDouble(poolCartesAJ1);
                    poolCartesAJ2Final = getRandomisationArray(poolCartesAJ1Final[1]);
                    poolCartesAJ1Final = getRandomisationArray(poolCartesAJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickBJ2:
                    poolCartesAJ1Final = generationPoolCartesDouble(poolCartesAJ1);
                    poolCartesBJ2Final = getRandomisationArray(poolCartesAJ1Final[1]);
                    poolCartesAJ1Final = getRandomisationArray(poolCartesAJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickCJ2:
                    poolCartesAJ1Final = generationPoolCartesDouble(poolCartesAJ1);
                    poolCartesCJ2Final = getRandomisationArray(poolCartesAJ1Final[1]);
                    poolCartesAJ1Final = getRandomisationArray(poolCartesAJ1Final[0]);
                    break;
                default:
                    poolCartesAJ1Final = getRandomisationArray(generationPoolCartesSingle(poolCartesAJ1, 0));
                    break;
            }

            switch (currentDraftKeyforge?.[0]?.FactionPickBJ1) {
                case currentDraftKeyforge?.[0]?.FactionPickAJ2:
                    poolCartesBJ1Final = generationPoolCartesDouble(poolCartesBJ1);
                    poolCartesAJ2Final = getRandomisationArray(poolCartesBJ1Final[1]);
                    poolCartesBJ1Final = getRandomisationArray(poolCartesBJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickBJ2:
                    poolCartesBJ1Final = generationPoolCartesDouble(poolCartesBJ1);
                    poolCartesBJ2Final = getRandomisationArray(poolCartesBJ1Final[1]);
                    poolCartesBJ1Final = getRandomisationArray(poolCartesBJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickCJ2:
                    poolCartesBJ1Final = generationPoolCartesDouble(poolCartesBJ1);
                    poolCartesCJ2Final = getRandomisationArray(poolCartesBJ1Final[1]);
                    poolCartesBJ1Final = getRandomisationArray(poolCartesBJ1Final[0]);
                    break;
                default:
                    poolCartesBJ1Final = getRandomisationArray(generationPoolCartesSingle(poolCartesBJ1, 0));
                    break;
            }

            switch (currentDraftKeyforge?.[0]?.FactionPickCJ1) {
                case currentDraftKeyforge?.[0]?.FactionPickAJ2:
                    poolCartesCJ1Final = generationPoolCartesDouble(poolCartesCJ1);
                    poolCartesAJ2Final = getRandomisationArray(poolCartesCJ1Final[1]);
                    poolCartesCJ1Final = getRandomisationArray(poolCartesCJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickBJ2:
                    poolCartesCJ1Final = generationPoolCartesDouble(poolCartesCJ1);
                    poolCartesBJ2Final = getRandomisationArray(poolCartesCJ1Final[1]);
                    poolCartesCJ1Final = getRandomisationArray(poolCartesCJ1Final[0]);
                    break;
                case currentDraftKeyforge?.[0]?.FactionPickCJ2:
                    poolCartesCJ1Final = generationPoolCartesDouble(poolCartesCJ1);
                    poolCartesCJ2Final = getRandomisationArray(poolCartesCJ1Final[1]);
                    poolCartesCJ1Final = getRandomisationArray(poolCartesCJ1Final[0]);
                    break;
                default:
                    poolCartesCJ1Final = getRandomisationArray(generationPoolCartesSingle(poolCartesCJ1, 0));
                    break;
            }

            if(poolCartesAJ2Final.length == 0) {
                poolCartesAJ2Final = generationPoolCartesSingle(poolCartesAJ2, 1);
            }

            if(poolCartesBJ2Final.length == 0) {
                poolCartesBJ2Final = generationPoolCartesSingle(poolCartesBJ2, 1);
            }

            if(poolCartesCJ2Final.length == 0) {
                poolCartesCJ2Final = generationPoolCartesSingle(poolCartesCJ2, 1);
            }
            const arrayFinalToCharge = [...poolCartesAJ1Final, ...poolCartesBJ1Final, ...poolCartesCJ1Final, ...poolCartesAJ2Final, ...poolCartesBJ2Final, ...poolCartesCJ2Final];

            const result = await enregistrementPoolsVersBdd(arrayFinalToCharge, currentDraftKeyforge[0].ID);
            if(result) {
                pullCurrentDraftPoolCards(currentDraftKeyforge[0].ID);
            } 
            else {
                return "erreur lors du chargement";
            }
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.error("Erreur génération du pool de cartes:", error);
            throw new Error(`Erreur HTTP ${error}`);
        }
    };

    const splitCardsByFaction = (arrayCartes, codeFaction) => {
        return arrayCartes
            .filter(prev => prev.Faction === codeFaction)
            .map(card => ({ ...card }));
    }

    const generationPoolCartesSingle = (poolCartesOriginal, joueurAorB) => {
        // copie du pool pour ne jamais modifier l’original
        const poolCartesReady = poolCartesOriginal.map(carte => ({ ...carte }));
        const arrayFinal = [];
        let securite = 0;

        while (arrayFinal.length < 36 && securite < 500) {
            securite++;

            // On filtre toutes les cartes encore disponibles
            const poolCartes = poolCartesReady.filter(current => current.QteDispo > 0);

            if (poolCartes.length === 0) break;

            const randomInt = getRandomUniqueNumbers(1, poolCartes.length - 1)[0];
            const carte = poolCartes[randomInt];

            // Si c'est une carte hors ensemble
            if (!carte.Ensemble) {
                carte.PlayerAorB = joueurAorB;
                carte.QteDispo -= 1;
                arrayFinal.push(carte);
            } 
            // Sinon c'est une carte d'ensemble
            else {
                const currentEnsemble = carte.Ensemble;

                // Récupération de toutes les cartes de cet ensemble
                const cartesEnsemble = poolCartesReady.filter(current => current.Ensemble === currentEnsemble && current.QteDispo > 0);

                // On vérifie qu'il reste assez de slots pour tout l'ensemble
                if (arrayFinal.length + cartesEnsemble.length <= 36) {
                    cartesEnsemble.forEach(current => {
                        current.PlayerAorB = joueurAorB;
                        current.QteDispo -= 1;
                        arrayFinal.push(current);
                    });
                }
            }
        }

        if (securite >= 500) {
            console.warn("Pool incomplet :", arrayFinal.length);
        }

        return arrayFinal;
    };

    const generationPoolCartesDouble = (poolCartesOriginal) => {
        // copie du pool pour ne jamais modifier l’original
        const poolCartesReady = poolCartesOriginal.map(carte => ({ ...carte }));
        const arrayFinal = [[], []]; // pour les 2 joueurs
        let securite = 0;

        // On alterne entre joueur 0 et 1 tant qu'on n'a pas rempli 36 cartes par joueur
        while ((arrayFinal[0].length < 36 || arrayFinal[1].length < 36) && securite < 1000) {
            securite++;

            for (let j = 0; j < 2; j++) {
                if (arrayFinal[j].length >= 36) continue; // joueur déjà rempli

                // on filtre les cartes encore disponibles
                const poolCartes = poolCartesReady.filter(current => current.QteDispo > 0);

                if (poolCartes.length === 0) break;

                const randomInt = getRandomUniqueNumbers(1, poolCartes.length - 1)[0];
                const carte = poolCartes[randomInt];

                if (!carte.Ensemble) {
                    // carte hors ensemble
                    carte.PlayerAorB = j;
                    carte.QteDispo -= 1;
                    arrayFinal[j].push(carte);
                } else {
                    // carte d'ensemble
                    const currentEnsemble = carte.Ensemble;
                    const cartesEnsemble = poolCartesReady.filter(c => c.Ensemble === currentEnsemble && c.QteDispo > 0);

                    if (arrayFinal[j].length + cartesEnsemble.length <= 36) {
                        cartesEnsemble.forEach(current => {
                            current.PlayerAorB = j;
                            current.QteDispo -= 1;
                            arrayFinal[j].push(current);
                        });
                    }
                    // sinon, on saute cette itération pour ce joueur
                }
            }
        }

        if (securite >= 1000) {
            console.warn("Pool incomplet pour l'un ou les deux joueurs :", arrayFinal.map(currentArray => currentArray.length));
        }

        return arrayFinal;
    };

    export default creationPoolCartes;