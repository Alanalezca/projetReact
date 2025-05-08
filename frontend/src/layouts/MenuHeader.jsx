import React from 'react';
import { useSessionUserContext } from '../components/contexts/sessionUserContext';
//import { useGlobalContext } from "../context/contextGlobalSession"
//import { useToastContext } from "../context/contextToast";
//import { useTracker } from "meteor/react-meteor-data";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import styles from './MenuHeader.module.css';
import Login from '../components/modals/Login';
import Subscribe from '../components/modals/Subscribe';
import LauncherLogin from '../components/modals/LauncherModal';
  
  const MenuHeader = ({}) => {
    const {sessionUser, setSessionUser} = useSessionUserContext();
    const [menuOpen, setMenuOpen] = useState(false);
    //const { showToast } = useToastContext();
    const logoutUser = async () => {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include', // IMPORTANT pour envoyer les cookies
      });

      if (response.ok) {
        setSessionUser(null); // Vide le contexte utilisateur
        console.log('Déconnexion réussie');
      } else {
        const data = await response.json();
        console.error('Erreur lors de la déconnexion :', data.message);
      }
    };

    //En cas de refresh de la page, on retourne chercher les éléments de session
    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/users/session', {
            credentials: 'include'
          });
          
          const data = await response.json();
          if (data) {
            setSessionUser(data.user);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }
      };
    
      checkSession();
    }, []);

    return (
    <><Login/><Subscribe/>
      <nav className={`txt-base ${styles.navbar}`}>
        {/* Menu Burger Mobile */} 
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
                  ☰
        </button>

        {/* Menu Principal */}
        <ul className={`${styles.MenuHeader} ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">News</Link></li>
          <li><Link to="/info">Articles</Link></li>
          <li>
              <a href="#">Drafteurs</a>
                <ul className={styles.subMenus}>
                  <li><Link to="/">News</Link></li>
                  <li><Link to="/">News</Link></li>
                </ul>
          </li>
          <li>
              <a href="#">Draftbuilders</a>
              <ul className={styles.subMenus}>
                  <li><Link to="/">News</Link></li>
                  <li><Link to="/">News</Link></li>
                </ul>
          </li>
        </ul>

        {/* Zone Utilisateur */}
        <div>
            {sessionUser ? (<div className={styles.userInfo}>
                <span className={`txtColorA txtBold ${styles.pseudoUser} ${styles.marginRight}`}>{sessionUser.pseudo}</span>
                  <div className={styles.btnDisconnect}><i className={`bx bxs-exit ${styles.bxNormalOrange} bxNormalOrange`} onClick={() => logoutUser()}></i>
                </div></div>
            ) : (<>
                  <div className={styles.btnLogin}><LauncherLogin libelleBtn="Connexion" target="modalLogin" /></div>
                </>
            )}
        </div>
      </nav>
    </>
    );
  };
  
  export default MenuHeader;