import { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FloatingLabel from '../inputs/FloatingInput';
import { useOngletAlerteContext } from '../contexts/ToastContext';
import styles from './Subscribe.module.css';

const SubscribeFormV2 = ({handleClose, show, handleShowLogin}) => {
  const { showOngletAlerte } = useOngletAlerteContext();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saisieOK, setSaisieOK] = useState(false);
  const [error, setError] = useState('');

  //const { showToast } = useToastContext();

  // Utilisation de useRef pour l'icône de fermeture
  const closeModalIconRefSubscribe = useRef(null);

  const handleKeyPressEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      soumissionFormCreationCompte(event); // Appel de la fonction pour valider la création de compte
    }
  };

  useEffect(() => {
    if (pseudo !== '' && email.includes("@") && email.includes(".") && password.length >= 6) {
      //setSaisieOK(true); a reactiver une fois développé
    } else {
      setSaisieOK(false);
    }
  }, [pseudo, email, password]);

  const soumissionFormCreationCompte = async (event) => {
    event.preventDefault();
    if (pseudo !== '' && email.includes("@") && email.includes(".") && password.length >= 6) {
        console.log("Tentative de création de compte");
        try {
          console.log("Tentative de création de compte (try)");
          const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo, email, password }),
          });
          const data = await response.json();
      
          if (!response.ok) {
            setError(data.error || 'Erreur lors de la création.');
            console.error('Erreur retournée par le serveur:', data.error);
            return;
          }
      
          //console.log('Utilisateur créé:', data.user);
          showOngletAlerte('success', '(Enregistrement)', '', 'Votre compte a bien été créé. Vous pouvez à présent vous connecter.');
          // Ici, tu peux fermer le modal et afficher une notification si tu veux
      
        } catch (err) {
          console.error('Erreur fetch:', err);
          setError('Une erreur s\'est produite.');
        }
      };
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bgcolorC modalTopBordBotTransparent">
        <Modal.Title className="txtColorWhite">S'enregistrer</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bgcolorC">
        <form onSubmit={soumissionFormCreationCompte} onKeyDown={handleKeyPressEnter}>
          <FloatingLabel
            strLibelleLabel="Identifiant"
            strTypeInput="text"
            value={pseudo}
            cbOnChange={(e) => setPseudo(e.target.value)}
            cbOnKeyDown={handleKeyPressEnter}
          />
          <FloatingLabel
            strLibelleLabel="Email"
            strTypeInput="email"
            value={email}
            cbOnChange={(e) => setEmail(e.target.value)}
            cbOnKeyDown={handleKeyPressEnter}
          />
          <FloatingLabel
            strLibelleLabel="Mot de passe"
            strTypeInput="password"
            value={password}
            cbOnChange={(e) => setPassword(e.target.value)}
            cbOnKeyDown={handleKeyPressEnter}
          />
        </form>
      </Modal.Body>

      <Modal.Footer className={styles.SubscribeModalBot}>
        <label className={styles.login} onClick={() => {handleShowLogin(true); handleClose(false);}} >Se connecter</label>
        <label> / </label>
        <label className={styles.login} onClick={() => {handleClose(false);}}>S'enregistrer</label>
        <Button
          id="btnValiderCreationCompte"
          variant="primary"
          className={saisieOK ? 'btn-ColorA' : 'btn-ColorInactif'}
          onClick={saisieOK ? soumissionFormCreationCompte : null}
          disabled={!saisieOK}
        >
          Valider l'enregistrement
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscribeFormV2;
