export const hasCardsForFaction = (pool, faction, joueur) => {
    if (!pool) return false;

    return pool.some(
        card =>
            card.IDFaction === faction &&
            card.JoueurAouB == joueur
    );
};

