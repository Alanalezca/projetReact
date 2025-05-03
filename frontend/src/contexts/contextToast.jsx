import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// 1 Création du contexte
const ToastContext = createContext();

// 2️ Provider qui gère le thème
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        strClassBGBlocTop:'bgcolorA',
        strClassBGBlocBottom: 'bgcolorA',
        strTextTopLeft: '',
        strTextTopRight: '',
        strTextBlocBottom: ''
    });

    const toastRef = useRef(null); // Pour stocker le DOM element
    const bsToastRef = useRef(null); // Pour stocker l’instance Bootstrap

    useEffect(() => {
        if (toastRef.current) {
            bsToastRef.current = new bootstrap.Toast(toastRef.current);
        }
    }, []);

    useEffect(() => {
        if (toastRef.current) {
            if (bsToastRef.current) {
                bsToastRef.current.dispose();
            }
            bsToastRef.current = new bootstrap.Toast(toastRef.current);
    
            // Ne pas show si pas de contenu (évite le toast blanc au chargement)
            if (toast.strTextBlocBottom !== '') {
                bsToastRef.current.show();
            }
        }
    }, [toast]);

    const showToast = async (type, textTopLeft, textTopRight, mainText) => {
        switch (type) {
            case "success":
                setToast({
                    strClassBGBlocTop: "toastBGTtopSuccess",
                    strClassBGBlocBottom: "toastBGTBottomSuccess",
                    strTextTopLeft: textTopLeft,
                    strTextTopRight: textTopRight,
                    strTextBlocBottom: mainText
                });
                break;
            case "error":
                setToast({
                    strClassBGBlocTop: "toastBGTtopDanger",
                    strClassBGBlocBottom: "toastBGTBottomDanger",
                    strTextTopLeft: textTopLeft,
                    strTextTopRight: textTopRight,
                    strTextBlocBottom: mainText
                });
                break;
            case "caution":
                setToast({
                    strClassBGBlocTop: "toastBGTtopCaution",
                    strClassBGBlocBottom: "toastBGTBottomCaution",
                    strTextTopLeft: textTopLeft,
                    strTextTopRight: textTopRight,
                    strTextBlocBottom: mainText
                });
                break;
            default:
                setToast({
                    strClassBGBlocTop: "toastBGTtopStandard",
                    strClassBGBlocBottom: "toastBGTBottomStandard",
                    strTextTopLeft: textTopLeft,
                    strTextTopRight: textTopRight,
                    strTextBlocBottom: mainText
                });
        }      
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
                    <div className="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container">
                        <div className={`toast ${toast.strClassBGBlocBottom}`} ref={toastRef} role="alert" aria-live="assertive" aria-atomic="true">
                            <div className={`toast-header ${toast.strClassBGBlocTop}`}>
                                <strong className="me-auto">{toast.strTextTopLeft}</strong>
                                <small>{toast.strTextTopRight}</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                {toast.strTextBlocBottom}
                            </div>
                        </div>
                    </div>
        </ToastContext.Provider>
    ); 
};

// 3 Hook permettant l'utilisation du contexte (export du context, en gros)
export const useToastContext = () => useContext(ToastContext);



