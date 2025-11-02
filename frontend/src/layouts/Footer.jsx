import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './Footer.module.css';
  const Footer = ({}) => {


    return (
        <>
            <div className={styles.Footer}>
                <div className="row">
                    <div className="col-lg-3 ">
                    </div>
                    <div className="col-lg-2">
                        <b>Le site</b>
                        <p className="mt-2 txtColorDarkBisLight alignIconText"><i className={`bx bx-info-circle bxMiniGreyWithoutAnim`}></i>À propos</p>
                        <p className="txtColorDarkBisLight alignIconText"><i className={`bx bx-code-alt bxMiniGreyWithoutAnim`}></i>Releases</p>
                        <p className="txtColorDarkBisLight alignIconText"><i className={`bx bx-file-find bxMiniGreyWithoutAnim`}></i>Mentions légales</p>
                        <p className="txtColorDarkBisLight alignIconText"><i className={`bx bx-low-vision bxMiniGreyWithoutAnim`}></i>Politique de confidentialité</p>
                    </div>
                    <div className="col-lg-2">
                        <b>Contacts</b>
                        <p className="mt-2 txtColorDarkBisLight alignIconText"><i className={`bx bx-envelope bxMiniGreyWithoutAnim`}></i>Email</p>
                        <p className="txtColorDarkBisLight alignIconText"><i className={`bx bxl-discord-alt bxMiniGreyWithoutAnim`}></i>Discord</p>
                    </div>
                    <div className="col-lg-2">
                        <b>Me soutenir</b>
                        <p className="mt-2 txtColorDarkBisLight alignIconText"><i className={`bx bxl-paypal bxMiniGreyWithoutAnim`}></i>Paypal</p>
                    </div>
                    <div className="col-lg-3">
                    </div>
                </div>
            </div>
        </>
    );
  };

  export default Footer;