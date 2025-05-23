import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import * as bootstrap from 'bootstrap';

// 1 Création du contexte
const ongletAlerteContext = createContext();

// 2️ Provider qui gère le thème
export const OngletAlerteProvider = ({ children }) => {
	const [ongletAlerte, setOngletAlerte] = useState({
    	strClassBGBlocTop: 'bgcolorA',
    	strClassBGBlocBottom: 'bgcolorA',
    	strTextTopLeft: '',
    	strTextTopRight: '',
    	strTextBlocBottom: ''
	});

	const ongletAlerteRef = useRef(null); // Pour stocker le DOM element
	const bsOngletAlerteRef = useRef(null); // Pour stocker l’instance Bootstrap

	useEffect(() => {
    	if (ongletAlerteRef.current) {
        	bsOngletAlerteRef.current = new bootstrap.Toast(ongletAlerteRef.current);
    	}
	}, []);

	useEffect(() => {
    	if (ongletAlerteRef.current) {
        	if (bsOngletAlerteRef.current) {
            	bsOngletAlerteRef.current.dispose();
        	}
        	bsOngletAlerteRef.current = new bootstrap.Toast(ongletAlerteRef.current);

        	// Ne pas show si pas de contenu (évite le ongletAlerte blanc au chargement)
        	if (ongletAlerte.strTextBlocBottom !== '') {
            	bsOngletAlerteRef.current.show();
        	}
    	}
	}, [ongletAlerte]);

	const showOngletAlerte = async (type, textTopLeft, textTopRight, mainText) => {
    	switch (type) {
        	case "success":
            	setOngletAlerte({
                	strClassBGBlocTop: "ongletAlerteBGTtopSuccess",
                	strClassBGBlocBottom: "ongletAlerteBGTBottomSuccess",
                	strTextTopLeft: textTopLeft,
                	strTextTopRight: textTopRight,
                	strTextBlocBottom: mainText
            	});
            	break;
        	case "error":
            	setOngletAlerte({
                	strClassBGBlocTop: "ongletAlerteBGTtopDanger",
                	strClassBGBlocBottom: "ongletAlerteBGTBottomDanger",
                	strTextTopLeft: textTopLeft,
                	strTextTopRight: textTopRight,
                	strTextBlocBottom: mainText
            	});
            	break;
        	case "caution":
            	setOngletAlerte({
                	strClassBGBlocTop: "ongletAlerteBGTtopCaution",
                	strClassBGBlocBottom: "ongletAlerteBGTBottomCaution",
                	strTextTopLeft: textTopLeft,
                	strTextTopRight: textTopRight,
                	strTextBlocBottom: mainText
            	});
            	break;
        	default:
            	setOngletAlerte({
                	strClassBGBlocTop: "ongletAlerteBGTtopStandard",
                	strClassBGBlocBottom: "ongletAlerteBGTBottomStandard",
                	strTextTopLeft: textTopLeft,
                	strTextTopRight: textTopRight,
                	strTextBlocBottom: mainText
            	});
    	}
	};

	return (
    	<ongletAlerteContext.Provider value={{ showOngletAlerte }}>
        	{children}
        	<div className="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container">
            	<div className={`toast ${ongletAlerte.strClassBGBlocBottom}`} ref={ongletAlerteRef} role="alert" aria-live="assertive" aria-atomic="true">
            	<div className={`toast-header ${ongletAlerte.strClassBGBlocTop}`}>
            	<strong className="me-auto">{ongletAlerte.strTextTopLeft}</strong>
            	<small>{ongletAlerte.strTextTopRight}</small>
            	<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        	</div>
        	<div className="toast-body">
            	{ongletAlerte.strTextBlocBottom}
        	</div>
    	</div>
                	</div >
    	</ongletAlerteContext.Provider >
	);
};

// 3 Hook permettant l'utilisation du contexte (export du context, en gros)
export const useOngletAlerteContext = () => useContext(ongletAlerteContext);
