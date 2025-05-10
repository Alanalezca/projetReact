import React, { useState, useRef, useEffect } from 'react';
import { useSessionUserContext } from '../contexts/sessionUserContext';
import FloatingLabel from '../inputs/FloatingInput';
import styles from './Login.module.css';

const LoginForm = () => {
  const [logOrEmail, setLogOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const {sessionUser, setSessionUser} = useSessionUserContext();

  const identification = async () => {
    const response = await fetch('http://localhost:5000/api/users/login', {
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
    } else {
      console.error('Erreur login :', data.message);
    }
  };

  return (
    <>
        <div className="modal fade" id="modalLogin" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bgcolorC modalTopBordBotTransparent">
                        <h5 className="modal-title txtColorWhite">Connexion</h5>
                        <i className={`bx bxs-x-square bxNormalOrange ${styles.bxTopRight}`} data-bs-dismiss="modal"></i>
                    </div>

                    <div className="modal-body bgcolorC">
                          <FloatingLabel strLibelleLabel="Identifiant ou email" strTypeInput="text" value={logOrEmail} cbOnChange={(e) => setLogOrEmail(e.target.value)} touchePressForCB={"Enter"}/>
                          <FloatingLabel strLibelleLabel="Mot de passe" strTypeInput="password" value={password} cbOnChange={(e) => setPassword(e.target.value)} touchePressForCB={"Enter"}/>
                    </div>

                    <div className={`modal-footer ${styles.LoginModalBot}`}>
                        <label className={styles.subscribe} data-bs-toggle="modal" data-bs-target="#modalSubscribe">S'enregistrer</label><label> / </label><label className={styles.subscribe}>Mot de passe oublié</label>
                        <button type="button" id="btnValidIDPass" className="btn btn-primary btn-ColorA" data-bs-dismiss="modal" onClick={(e) => identification()}>Connexion</button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

export default LoginForm;
