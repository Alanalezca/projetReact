import React from 'react';
import { useSessionUserContext } from '../components/contexts/sessionUserContext';
import { useOngletAlerteContext } from '../components/contexts/ToastContext';
//import { useTracker } from "meteor/react-meteor-data";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import styles from './MenuHeader.module.css';
import Login from '../components/modals/Login';
import Subscribe from '../components/modals/Subscribe';
  
  const MenuHeader = ({}) => {
    const { showOngletAlerte } = useOngletAlerteContext();
    const {sessionUser, setSessionUser} = useSessionUserContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [showModalSubscribe, setShowModalSubscribe] = useState(false);

    const logoutUser = async () => {
      console.log("cookies", document.cookie);
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include', // IMPORTANT pour envoyer les cookies
      });

      if (response.ok) { 
        setSessionUser(null); // Vide le contexte utilisateur
        console.log('Déconnexion réussie');
        showOngletAlerte('success', '(Déconnexion)', '', 'Vous êtes à présent déconnecté.');
      } else {
        const data = await response.json();
        console.error('Erreur lors de la déconnexion :', data.message);
      }
    };

    //En cas de refresh de la page, on retourne chercher les éléments de session
    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch('/api/users/session', {
            credentials: 'include'
          });
          
          const data = await response.json();
          if (data) {
            setSessionUser(data.user);
            console.log("cookies", document.cookie);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }
      };
    
      checkSession();
    }, []);

    return (
    <><Subscribe show={showModalSubscribe} handleClose={setShowModalSubscribe}/><Login show={showModalLogin} handleClose={setShowModalLogin} handleShowSubscribe={setShowModalSubscribe}/>
      <nav className={`txt-base ${styles.navbar}`}>
        {/* Menu Burger Mobile */} 
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
                  ☰
        </button>

        {/* Menu Principal */}
        <ul className={`${styles.MenuHeader} ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Articles</Link></li>
          <li>
              <a href="#">Outils</a>
                <ul className={styles.subMenus}>
                  <li><Link to="/">Smash Up</Link></li>
                </ul>
          </li>
        </ul>

        {/* Zone Utilisateur */}
        <div className={styles.blocLoginEnglobant}>
          <div className={styles.blocLogin}>
              {sessionUser ? (<div className={styles.userInfo}>
                  <span className={`txtColorA txtBold ${styles.pseudoUser} ${styles.marginRight}`}>{sessionUser.pseudo}</span>
                    <div className={styles.btnDisconnect}><i className={`bx bxs-exit ${styles.bxNormalOrange} bxNormalOrange`} onClick={() => logoutUser()}></i>
                  </div></div>
              ) : (<>
                      <button type="button" className={`btn btn-primary btn-ColorA ${styles.positionBtnCnx}`} onClick={() => setShowModalLogin(true)}>Connexion</button>
                  </>
              )}
          </div>
        </div>
      </nav>
    </>
    );
  };
  
  export default MenuHeader;