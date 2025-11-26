import React from 'react'; 
import { useState, useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import {Link} from "react-router-dom";
  const Footer = ({}) => {


    return (
        <>
            <div className={styles.Footer}>
                <div className="row">
                    <div className="col-lg-3 ">
                    </div>
                    <div className="col-lg-2">
                        <b>Le site</b>
                        <p className="mt-2 alignIconText"><i className={`bx bx-info-circle bxMiniGreyWithoutAnim`}></i><span className="txtColorDarkBisLight">À propos</span></p>
                        <p className="alignIconText"><i className={`bx bx-code-alt bxMiniGreyWithAnim`}></i><Link to={`/release/patchnotes`}><span className="txtColorDarkLight">Releases</span></Link></p>
                        <p className="alignIconText"><i className={`bx bx-file-find bxMiniGreyWithoutAnim`}></i><span className="txtColorDarkBisLight">Mentions légales</span></p>
                        <p className="alignIconText"><i className={`bx bx-low-vision bxMiniGreyWithoutAnim`}></i><span className="txtColorDarkBisLight">Politique de confidentialité</span></p>
                    </div>
                    <div className="col-lg-2">
                        <b>Contacts</b>
                            <p className="mt-2 alignIconText">
                                <i className={`bx bx-envelope bxMiniGreyWithAnim`}></i>
                                <span className="txtColorDarkLight">
                                    <a
                                    href="mailto:alana_forever@hotmail.com?subject=%5BParlons%20carton%5D%20Contact&body=Bonjour,%0A..."
                                    >
                                    Email
                                    </a>
                                </span>
                            </p>
                        <p className="alignIconText"><i className={`bx bxl-discord-alt bxMiniGreyWithAnim`}></i><span className="txtColorDarkLight">Discord</span></p>
                    </div>
                    <div className="col-lg-2">
                        <b>Me soutenir</b>
                        <p className="mt-2 alignIconText"><i className={`bx bxl-paypal bxMiniGreyWithoutAnim`}></i><span className="txtColorDarkBisLight">Paypal</span></p>
                    </div>
                    <div className="col-lg-3">
                    </div>
                </div>
            </div>
        </>
    );
  };

  export default Footer;