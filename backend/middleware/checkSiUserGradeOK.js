// Vérifie le grade de l'utilisateur de la session actuelle
export function checkSiCurrentUserGetGradeRequis(...gradesRequis) {
  return (req, res, next) => {
    if (!req.session.user ) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    if (!gradesRequis.includes(req.session.user.grade)) {
      return res.status(403).json({ message: 'Accès refusé : grade insuffisant' });
    }
    next();
  };
}