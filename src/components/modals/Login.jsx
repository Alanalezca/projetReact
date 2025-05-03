import React, { useState } from 'react';
//import { Meteor } from 'meteor/meteor';
//import { useGlobalContext } from "../../components/context/contextGlobalSession"
//import { useNavigate } from 'react-router-dom';
import FloatingLabel from '../inputs/FloatingInput';
//import './../../main.css';
import styles from './Login.module.css';

const LoginForm = () => {
  const [logOrEmail, setLogOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //const history = useHistory();
  //const { sessionUser, setSessionUser } = useGlobalContext();


  // Créer une référence pour l'icône de fermeture
  const closeModalIconRef = React.useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Empêche la soumission si nécessaire
      //validerIDPass(event); // Appel de la fonction pour valider la connexion
    }
  };

  //const validerIDPass = async (event) => {
  //  console.log('tentative de connexion');
  //  event.preventDefault();
  //  // Appel à la méthode Meteor.loginWithPassword
  //  Meteor.loginWithPassword(logOrEmail, password, (err) => {
  //    if (err) {
  //      setError('Identifiants incorrects');
  //    } else {
  //      console.log('On est loggués');
  //      setSessionUser(Meteor.user());
  //      console.log(Meteor.user().profile.pseudo);
  //      // Simuler un clic sur l'icône de fermeture pour cacher le modal
  //      if (closeModalIconRef.current) {
  //        closeModalIconRef.current.click();
  //      }
  //
  //      // Rediriger l'utilisateur vers la page actuelle sans rechargement
  //      navigate(window.location.pathname)
  //    }
  //  });
  //};

  return (
    <>
        <div className="modal" id="modalLogin" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bgcolorC modalTopBordBotTransparent">
                        <h5 className="modal-title txtColorWhite">Connexion</h5>
                        <i className={`bx bxs-x-square bxNormalOrange ${styles.bxTopRight}`} ref={closeModalIconRef} data-bs-dismiss="modal"></i>
                    </div>

                    <div className="modal-body bgcolorC">
                        {/*<form onSubmit={validerIDPass} onKeyDown={handleKeyPress}>*/}
                        <form>
                          <FloatingLabel strLibelleLabel="Identifiant ou email" strTypeInput="text" value={logOrEmail} cbOnChange={(e) => setLogOrEmail(e.target.value)} touchePressForCB={"Enter"}/>
                          <FloatingLabel strLibelleLabel="Mot de passe" strTypeInput="password" value={password} cbOnChange={(e) => setPassword(e.target.value)} touchePressForCB={"Enter"}/>
                        </form>
                    </div>

                    <div className={`modal-footer ${styles.LoginModalBot}`}>
                        <label className={styles.subscribe} data-bs-toggle="modal" data-bs-target="#modalSubscribe">S'enregistrer</label><label> / </label><label className={styles.subscribe}>Mot de passe oublié</label>
                        <button type="button" id="btnValidIDPass" className="btn btn-primary btn-ColorA" data-bs-dismiss="modal">Connexion</button>
                        {/*<button type="button" id="btnValidIDPass" className="btn btn-primary btn-ColorA" onClick={validerIDPass} data-bs-dismiss="modal">Connexion</button>*/}
                    </div>
                </div>
            </div>
        </div>
    </>
  )};

export default LoginForm;