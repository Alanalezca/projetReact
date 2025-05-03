import React from 'react';
//import { useGlobalContext } from "../context/contextGlobalSession"
//import { useToastContext } from "../context/contextToast";
//import { useTracker } from "meteor/react-meteor-data";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import styles from './MenuHeader.module.css';
import Login from '../modals/Login';
import Subscribe from '../modals/Subscribe';
import LauncherLogin from '../modals/LauncherModal';
  
  const MenuHeader = ({}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    //const history = useHistory();
    //const { showToast } = useToastContext();

    //Récupération des variables de contexte
    const { sessionUser, setSessionUser } = "varContext";

    //useTracker change la valeur de MeteorLoaded dès qu'il récupère le Meteor.user()
    //const MeteorLoaded = useTracker(() => Meteor.user(), []);

    //Dès MeteorLoaded est modifié, on affecte au context.sessionUser les informations user stockées dans la session Meteor
    //useEffect(() => {
      //(!sessionUser && Meteor.user()) ? setSessionUser(Meteor.user()) : "";
    //}, [MeteorLoaded]);


    const logoutUser = () => {
      //.logout(() => {
        //showToast('success', 'Notification', 'Déconnexion', `Votre session est à présent déconnectée !`);
        //setSessionUser(null); // Vide le contexte
        //history.push("/");
      //});
    };

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
        <div className={styles.userInfo}>
            {sessionUser ? (<>
                <span className={`txtColorA txtBold ${styles.pseudoUser}`}>
                  {sessionUser.username}</span>
                  <div className={styles.btnDisconnect}><i className={`bx bxs-exit ${styles.bxNormalOrange}`} onClick={() => logoutUser()}></i>
                </div></>
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