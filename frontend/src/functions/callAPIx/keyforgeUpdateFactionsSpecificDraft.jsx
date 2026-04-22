
// Insère en bdd les factions picks et bans par les 2 joueurs
// et retourne le succès ou l'erreur de l'update

const updateFactionsCurrentDraft = async (
  idDraft,
  factionBanJ1,
  factionPickAJ1,
  factionPickBJ1,
  factionPickCJ1,
  factionBanJ2,
  factionPickAJ2,
  factionPickBJ2,
  factionPickCJ2
) => {

  const response = await fetch("/api/keyforge/updateFactionsSpecificDraft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parID: idDraft,
      parFactionBanJ1: factionBanJ1,
      parFactionBanJ2: factionBanJ2,
      parFactionPickAJ1: factionPickAJ1,
      parFactionPickBJ1: factionPickBJ1,
      parFactionPickCJ1: factionPickCJ1,
      parFactionPickAJ2: factionPickAJ2,
      parFactionPickBJ2: factionPickBJ2,
      parFactionPickCJ2: factionPickCJ2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur HTTP ${response.status} : ${errText}`);
  }

  return response.json(); // ou true si t’as rien à renvoyer
};

export default updateFactionsCurrentDraft;