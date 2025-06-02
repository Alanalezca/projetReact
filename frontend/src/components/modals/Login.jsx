import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useSessionUserContext } from '../contexts/sessionUserContext';
import { useOngletAlerteContext } from '../contexts/ToastContext';
import styles from './Login.module.css';
import FloatingLabel from '../inputs/FloatingInput';

const LoginForm2 = ({ handleClose, show, handleShowSubscribe}) => {
  const { showOngletAlerte } = useOngletAlerteContext();
  const [logOrEmail, setLogOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const {sessionUser, setSessionUser} = useSessionUserContext();

  const identification = async () => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      credentials: 'include', // IMPORTANT pour envoyer les cookies
      headers: {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({ identifiant: logOrEmail.toLowerCase(), password: password }),
    });

    const data = await response.json();
    if (response.ok) {
      setSessionUser(data.user);
      console.log('Connecté :', data);
      console.log('Connecté :', data.user);
      console.log("cookies", document.cookie);
      handleClose(false);
      showOngletAlerte('success', '(Identification)', '', 'Vous êtes à présent connecté.');
    } else {
      console.error('Erreur login :', data.message);
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)} centered>
      <Modal.Header closeButton className={`${styles.borderTop} bgcolorC modalTopBordBotTransparent`}>
        <Modal.Title className="txtColorWhite">Connexion</Modal.Title>
      </Modal.Header>

      <Modal.Body className={`bgcolorC ${styles.borderMid}`}>
        <FloatingLabel strLibelleLabel="Identifiant ou email" strTypeInput="text" value={logOrEmail} cbOnChange={(e) => setLogOrEmail(e.target.value)} touchePressForCB={"Enter"}/>
        <FloatingLabel strLibelleLabel="Mot de passe" strTypeInput="password" value={password} cbOnChange={(e) => setPassword(e.target.value)} touchePressForCB={"Enter"}/>
      </Modal.Body>

      <Modal.Footer className={`${styles.LoginModalBot} ${styles.borderBottom}`}>
        <label className={styles.subscribe} onClick={() => {handleShowSubscribe(true); handleClose(false);}}>S'enregistrer</label>
        <label> / </label>
        <label className={styles.subscribe}>Mot de passe oublié</label>
        <Button variant="primary" className="btn-ColorA" onClick={(e) => identification()}>
          Connexion
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginForm2;