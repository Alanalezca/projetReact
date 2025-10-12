
// Fonction permettant de créer une alternative au onClick, le Hold (maintient cliqué X ms)
export const handleHoldStart = (timerRef, callback, holdTime = 1000) => {
  timerRef.current = setTimeout(() => {
    callback();
  }, holdTime);
};

export const handleHoldEnd = (timerRef) => {
  clearTimeout(timerRef.current);
};