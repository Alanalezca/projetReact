
const DraftKeyforgeStatsResume = ({ nbLegendaires, pseudoJ1, pseudoJ2 }) => {

  const deltaLegendaires = Math.abs(nbLegendaires[0] - nbLegendaires[1]);

  const joueurPorteurMalus =
    nbLegendaires[0] > nbLegendaires[1]
      ? 0
      : nbLegendaires[1] > nbLegendaires[0]
      ? 1
      : null;

  const joueur =
    joueurPorteurMalus === 0
      ? pseudoJ1
      : joueurPorteurMalus === 1
      ? pseudoJ2
      : null;

  const classeCouleur =
    joueurPorteurMalus === 0
      ? 'txtColorPlayerRed'
      : joueurPorteurMalus === 1
      ? 'txtColorPlayerBlue'
      : '';

  return (
    <div className="col-12 text-center">
      <p>
        Nombre de légendaires draftées :
        <span className="txtColorPlayerRed txtBold"> {nbLegendaires[0]} </span> -
        <span className="txtColorPlayerBlue txtBold"> {nbLegendaires[1]}</span>
      </p>

      {deltaLegendaires > 0 ? (
        <p className="txtBold">
          <span className={classeCouleur}> {joueur} </span>
          subit un malus :
          <span className={classeCouleur}> {deltaLegendaires}</span>
          chaîne{deltaLegendaires > 1 && "s"}
        </p>
      ) : (
        <p className="txtBold">
          Aucun chaînage n'est appliqué
        </p>
      )}
    </div>
  );
};

export default DraftKeyforgeStatsResume;



